document.addEventListener("DOMContentLoaded", function () {
  // Initialize the map
  var map = L.map("map", { preferCanvas: true }).setView(
    [37.7749, -122.4194],
    5
  );

  // Add a tile layer (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Variable to hold the existing chart instance
  var existingChart = null;

  // Predefined colors for the selected stores
  var predefinedColors = [
    "#EDC948",
    "#F28E2B",
    "#E15759",
    "#76B7B2",
    "#59A14F",
    "#B07AA1",
    "#FF9DA7",
    "#9C755F",

    // "#FF9304", // Orange
    // "#C70100", // Red
    // "#50F2CE", // Teal
    // "#0DB85C", // Green
    // "#EDE700", // Yellow
    // "#4C1796", // Purple
    // "#FF307F", // Pink
    // "#C4632B", // Brown
  ];

  // Default color for unselected stores
  var defaultColor = "#003F5C";

  // Storeid to color mapping
  var storeidColors = {};
  var displayedStores = [];
  var storeData = [];
  var markers = {}; // Object to hold markers

  // Function to create custom marker with a shape like a traditional map marker
  function createCustomIcon(color) {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(315deg); border: 2px solid white;"></div>`,
      className: "custom-marker",
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -35],
    });
  }

  // Add GeoJSON layer for state boundaries
  $.getJSON(
    "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json",
    function (data) {
      L.geoJson(data, {
        style: function (feature) {
          return {
            color: "#000",
            weight: 1,
            fillOpacity: 0.2,
          };
        },
      }).addTo(map);
    }
  );

  // Function to fetch store data by state and generate bar chart
  function fetchStoreDataByState(state) {
    $.ajax({
      url: `http://127.0.0.1:8000/revenue-by-store/?state=${state}`,
      dataType: "json",
      success: function (data) {
        storeData = data;
        displayedStores = data.slice(0, 8); // Initially display first 8 stores
        assignPredefinedColors();
        generateBarChart(displayedStores);
        processStoreData(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching store data by state:",
          textStatus,
          errorThrown
        );
      },
    });
  }

  // Function to assign predefined colors to the initially displayed stores
  function assignPredefinedColors() {
    displayedStores.forEach((store, index) => {
      storeidColors[store.storeid] = predefinedColors[index];
    });

    storeData.forEach((store) => {
      if (!storeidColors[store.storeid]) {
        storeidColors[store.storeid] = defaultColor;
      }
    });
  }

  // Function to generate bar chart
  function generateBarChart(data) {
    var ctx = document.getElementById("barChart").getContext("2d");

    // Destroy existing chart instance if it exists
    if (existingChart) {
      existingChart.destroy();
    }

    var labels = data.map((store) => store.storeid);
    var revenues = data.map((store) => parseFloat(store.revenue));

    existingChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sales Revenue",
            data: revenues,
            backgroundColor: labels.map((id) => storeidColors[id]),
            borderColor: labels.map((id) => storeidColors[id]),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Function to process customer data for heatmap
  function processCustomerData(data) {
    var customerHeatArray = [];

    data.customer_locations.forEach(function (point) {
      var latitude = parseFloat(point.latitude);
      var longitude = parseFloat(point.longitude);
      customerHeatArray.push([latitude, longitude]);
    });

    return customerHeatArray;
  }

  // Function to fetch customer data from backend
  function fetchCustomerData() {
    $.ajax({
      url: "/customer-locations/", // Replace with your actual backend URL
      dataType: "json",
      success: function (data) {
        var customerHeatArray = processCustomerData(data);

        // Add the customer heatmap layer to the map
        L.heatLayer(customerHeatArray, {
          radius: 25,
          gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
        }).addTo(map);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching customer data:", textStatus, errorThrown);
        // Handle error appropriately, e.g., display an error message to the user
      },
    });
  }

  // Function to fetch store data from backend
  function fetchStoreData() {
    $.ajax({
      url: "http://127.0.0.1:8000/revenue-by-store/", // Replace with your actual backend URL
      dataType: "json",
      success: function (data) {
        storeData = data;
        displayedStores = data.slice(0, 8); // Initially display first 8 stores
        assignPredefinedColors();
        generateBarChart(displayedStores);
        processStoreData(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching store data:", textStatus, errorThrown);
        // Handle error appropriately, e.g., display an error message to the user
      },
    });
  }

  // Function to process store data and add markers to the map
  function processStoreData(data) {
    data.forEach(function (store) {
      var latitude = parseFloat(store.latitude);
      var longitude = parseFloat(store.longitude);

      var customIcon = createCustomIcon(storeidColors[store.storeid]);

      var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
        map
      );

      marker.bindPopup(
        `<b>Store ID:</b> ${store.storeid}<br>
         <b>Zipcode:</b> ${store.zipcode}<br>
         <b>City:</b> ${store.city}<br>
         <b>Revenue:</b> $${parseFloat(store.revenue).toLocaleString()}`
      );

      marker.on("click", function () {
        // Handle marker click
        handleMarkerClick(store);
      });

      markers[store.storeid] = marker;
    });
  }

  // Function to handle marker click and update bar chart
  function handleMarkerClick(store) {
    if (!displayedStores.find((s) => s.storeid === store.storeid)) {
      // Save the color of the first store in the displayed list
      var replacedColor = storeidColors[displayedStores[0].storeid];

      // Replace the first store with the clicked store
      var removedStore = displayedStores.shift();
      displayedStores.push(store);

      // Update the colors
      storeidColors[removedStore.storeid] = defaultColor;
      storeidColors[store.storeid] = replacedColor;

      // Update the bar chart with new store data
      generateBarChart(displayedStores);

      // Update the markers
      markers[removedStore.storeid].setIcon(createCustomIcon(defaultColor));
      markers[store.storeid].setIcon(createCustomIcon(replacedColor));
    }
  }

  // Fetch customer data on page load
  fetchCustomerData();
  // Fetch store data on page load
  fetchStoreData();
});

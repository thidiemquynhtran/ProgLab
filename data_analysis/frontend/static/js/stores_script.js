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

  // Variables to hold the existing chart and heatmap instances
  var existingChart = null;
  var heatmapChart = null;

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
        plugins: {
          legend: {
            display: false, // Remove legend
          },
        },
      },
    });
  }

  // Function to generate heatmap
  function generateHeatmap(data) {
    if (heatmapChart) {
      heatmapChart.dispose();
    }

    heatmapChart = echarts.init(document.getElementById("heatmap"));

    var stores = displayedStores.map((store) => store.storeid);
    var categories = Array.from(new Set(data.map((item) => item.category)));
    var heatmapData = [];

    categories.forEach((category, i) => {
      stores.forEach((store, j) => {
        var item = data.find(
          (d) => d.store_id === store && d.category === category
        );
        heatmapData.push([j, i, item ? parseFloat(item.revenue) : 0]);
      });
    });

    var option = {
      title: {
        text: "Heatmap of Revenue by Category and Store",
        left: "center",
      },
      tooltip: {
        position: "top",
        formatter: function (params) {
          return `${categories[params.value[1]]}<br>${
            stores[params.value[0]]
          }<br>Revenue: $${params.value[2].toFixed(2)}`;
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: stores,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: categories,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 17319.21,
        max: 1122040.42, // Adjust based on actual data range
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "5%",
        inRange: {
          color: ["#e0ffff", "#006edd"],
        },
      },
      series: [
        {
          name: "Revenue",
          type: "heatmap",
          data: heatmapData,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    heatmapChart.setOption(option);
  }

  // Function to fetch store-category revenue data
  function fetchStoreCategoryRevenue() {
    return $.ajax({
      url: "http://127.0.0.1:8000/store-category-revenue/", // Replace with your actual backend URL
      dataType: "json",
    });
  }

  // Function to handle marker click and update bar chart and heatmap
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

      // Fetch store-category revenue data and update heatmap
      fetchStoreCategoryRevenue().then((data) => {
        var relevantData = data.filter((d) =>
          displayedStores.find((s) => s.storeid === d.store_id)
        );
        generateHeatmap(relevantData);
      });
    }
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
        fetchStoreCategoryRevenue().then((data) => {
          var relevantData = data.filter((d) =>
            displayedStores.find((s) => s.storeid === d.store_id)
          );
          generateHeatmap(relevantData);
        });
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

  // Fetch customer data on page load
  fetchCustomerData();
  // Fetch store data on page load
  fetchStoreData();
});

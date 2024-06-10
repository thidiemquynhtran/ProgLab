document.addEventListener("DOMContentLoaded", function () {
  // Initialize the map
  //var map = L.map('map').setView([37.7749, -122.4194], 5);
  var map = L.map("map", { preferCanvas: true }).setView(
    [37.7749, -122.4194],
    5,
    { width: "100%", height: "600px" }
  );

  // Add a tile layer (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

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

      var marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(
        `<b>Store ID:</b> ${store.storeid}<br>
         <b>Zipcode:</b> ${store.zipcode}<br>
         <b>City:</b> ${store.city}<br>
         <b>Revenue:</b> $${parseFloat(store.revenue).toLocaleString()}`
      );
    });
  }

  // Fetch customer data on page load
  fetchCustomerData();
  // Fetch store data on page load
  fetchStoreData();
});

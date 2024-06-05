$(document).ready(function () {
  var lineChart;

  function fetchData() {
    // Fetch total customers and average order value
    $.ajax({
      url: "http://127.0.0.1:8000/total-customers/", // Update with your actual endpoint URL
      method: "GET",
      success: function (response) {
        $("#totalCustomers").text(response.total_customers);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching total customers data:", error);
        // Handle error case here
      },
    });

    // Fetch average order value
    $.ajax({
      url: "http://127.0.0.1:8000/average-order-value/", // Update with your actual endpoint URL
      method: "GET",
      success: function (response) {
        $("#averageOrderValue").text(response.average_order_value);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching average order value data:", error);
        // Handle error case here
      },
    });

    // Fetch total orders
    $.ajax({
      url: "http://127.0.0.1:8000/total-orders/",
      method: "GET",
      success: function (response) {
        $("#totalOrders").text(response.total_orders);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching total orders data:", error);
        // Handle error case here
      },
    });

    // Fetch total revenue
    $.ajax({
      url: "http://127.0.0.1:8000/total-revenue/",
      method: "GET",
      success: function (response) {
        $("#totalRevenue").text(response.total_revenue);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching total revenue data:", error);
        // Handle error case here
      },
    });
  }
  function loadLineChart() {
    $.ajax({
      url: "/total-revenue-by-month", // Beispiel-URL für die Daten der Line-Chart
      method: "GET",
      dataType: "json",
      success: function (data) {
        createLineChart(data);
      },
      error: function (error) {
        console.error("Error fetching line chart data", error);
      },
    });

    // Fetch repeat purchase rate
    $.ajax({
      url: "http://127.0.0.1:8000/repeat-purchase-rate/",
      method: "GET",
      success: function (response) {
        $("#repeatPurchaseRate").text(response.repeat_purchase_rate);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching repeat purchase rate data:", error);
        // Handle error case here
      },
    });
  }

  function createLineChart(data) {
    var months = data.map((item) => item.month);
    var totalRevenueData = data.map((item) => parseFloat(item.total_revenue));

    var ctx = document.getElementById("lineChart").getContext("2d");
    if (lineChart) {
      lineChart.destroy();
    }
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Total Revenue",
            data: totalRevenueData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
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

  // Wenn der Benutzer auf den Link "Customers" in der Navbar klickt, lade die Line-Chart
  $('a[href="customers.html"]').click(function (e) {
    e.preventDefault(); // Standardnavigation unterbinden
    loadLineChart(); // Funktion zum Laden der Line-Chart aufrufen
  });

  fetchData(); // Funktion zum Laden der Daten aufrufen
});

$(document).ready(function () {
  var lineChart;

  function fetchData() {
    // Fetch total customers and average order value
    $.ajax({
      url: "http://127.0.0.1:8000/total-customers/",
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
      url: "http://127.0.0.1:8000/average-order-value/",
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

  function loadLineChart() {
    $.ajax({
      url: "http://127.0.0.1:8000/monthly-sales-progress/", // Update with your actual endpoint URL
      method: "GET",
      dataType: "json",
      success: function (data) {
        createLineChart(data);
      },
      error: function (error) {
        console.error("Error fetching line chart data", error);
      },
    });
  }

  function createLineChart(data) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var series = [];

    for (var year in data) {
      var yearData = data[year];
      var salesData = new Array(12).fill(0);

      yearData.forEach(function (monthData) {
        var monthIndex = months.indexOf(monthData.month);
        if (monthIndex !== -1) {
          salesData[monthIndex] = monthData.total_sales;
        }
      });

      series.push({
        name: `Total Sales ${year}`,
        type: "line",
        data: salesData,
      });
    }

    var chartDom = document.getElementById("lineChart");
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: "Monthly Sales Progress",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: series.map((s) => s.name),
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: months,
      },
      yAxis: {
        type: "value",
      },
      series: series,
    };

    option && myChart.setOption(option);
  }

  // Call the loadLineChart function initially to render the line chart when the site is opened
  loadLineChart();

  fetchData(); // Fetch other data
});

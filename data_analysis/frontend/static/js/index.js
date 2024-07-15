$(document).ready(function () {
  function fetchData() {
    // Fetch average order value
    $.ajax({
      url: "http://127.0.0.1:8000/average-order-value/",
      method: "GET",
      success: function (response) {
        // Ensure the value has only two decimal places and add a dollar sign after the number
        var formattedValue =
          parseFloat(response.average_order_value).toFixed(2) + " $";
        $("#averageOrderValue").text(formattedValue);
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
        // Ensure the value has only two decimal places and add a dollar sign after the number
        var formattedValue =
          parseFloat(response.total_revenue).toFixed(2) + " $";
        $("#totalRevenue").text(formattedValue);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching total revenue data:", error);
        // Handle error case here
      },
    });
  }

  function loadLineChart() {
    $.ajax({
      url: "http://127.0.0.1:8000/api/totalOrders/Line",
      method: "GET",
      dataType: "json",
      success: function (data) {
        createLineChart(
          data,
          "totalOrdersChart",
          "Monthly Total Orders",
          "total_orders"
        );
      },
      error: function (error) {
        console.error("Error fetching line chart data", error);
      },
    });

    $.ajax({
      url: "http://127.0.0.1:8000/api/average_order_value_Line/",
      method: "GET",
      dataType: "json",
      success: function (data) {
        createLineChart(
          data,
          "averageOrderValueChart",
          "Monthly Average Order Value",
          "average_order_value"
        );
      },
      error: function (error) {
        console.error("Error fetching line chart data", error);
      },
    });
  }

  function createLineChart(data, chartId, chartTitle, dataKey) {
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

    var series = {};
    data.forEach(function (item) {
      if (!series[item.year]) {
        series[item.year] = new Array(12).fill(0);
      }
      var monthIndex = months.indexOf(item.month);
      if (monthIndex !== -1) {
        series[item.year][monthIndex] = item[dataKey];
      }
    });

    var seriesData = Object.keys(series).map(function (year) {
      return {
        name: `${chartTitle} ${year}`,
        type: "line",
        data: series[year],
      };
    });

    var chartDom = document.getElementById(chartId);
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: chartTitle,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: seriesData.map((s) => s.name),
        top: 40,
      },
      grid: {
        left: "7%",
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
        name: chartTitle,
      },
      series: seriesData,
    };

    option && myChart.setOption(option);
  }

  loadLineChart();
  fetchData(); // Fetch other data
});

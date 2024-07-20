document.addEventListener("DOMContentLoaded", function () {
  var scatterChart = null;
  var orderDistanceChart = null;
  var lineChart = null;

  function generateScatterPlot(data) {
    if (scatterChart) {
      scatterChart.dispose();
    }

    scatterChart = echarts.init(
      document.getElementById("revenue-vs-items-sold")
    );

    var scatterData = data.map(function (store) {
      return {
        value: [parseInt(store.total_items), parseFloat(store.total_revenue)],
        storeID: store.storeID,
      };
    });

    var option = {
      title: {
        text: "Scatter Plot of Revenue vs. Number of Items Sold per Store",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          var data = params.data;
          return `Store ID: ${data.storeID}<br>Items Sold: ${
            data.value[0]
          }<br>Revenue: $${data.value[1].toFixed(2)}`;
        },
      },
      grid: {
        left: "10%",
        right: "22%", // Increased right padding
        bottom: "15%", // Increased bottom padding for x-axis labels
      },
      xAxis: {
        type: "value",
        name: "Number of Items Sold",
        min: 0,
        // axisLabel: {
        //   rotate: 45, // Rotate labels if necessary
        // },
      },
      yAxis: {
        type: "value",
        name: "Total Revenue",
        min: 0,
      },
      series: [
        {
          symbolSize: 10,
          data: scatterData,
          type: "scatter",
        },
      ],
    };

    scatterChart.setOption(option);
  }

  function generateOrderDistanceChart(data) {
    if (orderDistanceChart) {
      orderDistanceChart.dispose();
    }

    orderDistanceChart = echarts.init(
      document.getElementById("order-distance-aggregates")
    );

    var distances = data.map((item) => item.distance_rounded);
    var orderCounts = data.map((item) => item.order_count);
    var avgOrderValues = data.map((item) => parseFloat(item.avg_order_value));

    var option = {
      title: {
        text: "Distribution of Orders by Distance",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      grid: {
        left: "10%",
        right: "20%", // Increased right padding
        bottom: "15%", // Increased bottom padding for x-axis labels
      },
      xAxis: [
        {
          type: "category",
          data: distances,
          name: "Distance (km)",
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Number of Orders",
          min: 0,
          axisLabel: {
            formatter: "{value}",
          },
        },
        {
          type: "value",
          name: "Average Order Value ($)",
          min: 0,
          axisLabel: {
            formatter: "{value}",
          },
        },
      ],
      series: [
        {
          name: "Number of Orders",
          type: "bar",
          data: orderCounts,
        },
        {
          name: "Average Order Value ($)",
          type: "line",
          yAxisIndex: 1,
          data: avgOrderValues,
        },
      ],
    };

    orderDistanceChart.setOption(option);
  }

  function loadLineChart() {
    $.ajax({
      url: "http://127.0.0.1:8000/monthly-sales-progress/", 
      method: "GET",
      dataType: "json",
      success: function (data) {
        createLineChart(data);
      },
      error: function (error) {
        console.error("Error fetching line chart data", error);
        loadMockData(); // Load mock data if there's an error
      },
    });
  }

  function createLineChart(data) {
    if (lineChart) {
      lineChart.dispose();
    }

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
    lineChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: "Monthly Total Sales of All Stores",
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

    option && lineChart.setOption(option);
  }

  function loadMockData() {
    var totalOrdersData = [
      {
        name: "2022",
        type: "line",
        data: [120, 132, 101, 134, 90, 230, 210, 180, 190, 220, 240, 250],
      },
      {
        name: "2023",
        type: "line",
        data: [150, 232, 201, 154, 190, 330, 410, 320, 310, 340, 360, 370],
      },
      {
        name: "2024",
        type: "line",
        data: [170, 282, 251, 234, 290, 430, 510, 420, 410, 440, 460, 470],
      },
    ];

    createMockLineChart("lineChart", "Total Orders", "Orders", totalOrdersData);
  }

  function createMockLineChart(chartId, title, yAxisLabel, seriesData) {
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

    var chartDom = document.getElementById(chartId);
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: title,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: seriesData.map((s) => s.name),
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
        name: yAxisLabel,
      },
      series: seriesData,
    };

    option && myChart.setOption(option);
  }

  function fetchStoreRevenueItems() {
    $.ajax({
      url: "http://127.0.0.1:8000/store_revenue_items/",
      dataType: "json",
      success: function (data) {
        generateScatterPlot(data);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
      },
    });
  }

  function fetchOrderDistanceAggregates() {
    $.ajax({
      url: "http://127.0.0.1:8000/order_distance_aggregates/",
      dataType: "json",
      success: function (data) {
        generateOrderDistanceChart(data);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
      },
    });
  }

  // Initial data fetch calls
  fetchStoreRevenueItems();
  fetchOrderDistanceAggregates();
  loadLineChart(); // Load the line chart
});

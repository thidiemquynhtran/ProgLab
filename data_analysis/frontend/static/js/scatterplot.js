document.addEventListener("DOMContentLoaded", function () {
  var scatterChart = null;
  var orderDistanceChart = null;

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
          name: "Distance (miles)",
          // axisLabel: {
          //   rotate: 45, // Rotate labels if necessary
          // },
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

  fetchStoreRevenueItems();
  fetchOrderDistanceAggregates();
});

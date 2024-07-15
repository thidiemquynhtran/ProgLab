document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch data from the backend for CLV vs Orders
  function fetchCLVData() {
    fetch("http://127.0.0.1:8000/clv-vs-orders/")
      .then((response) => response.json())
      .then((data) => {
        var processedData = data.map((item) => [
          item.total_orders,
          parseFloat(item.clv),
        ]);
        renderCLVChart(processedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Function to render the CLV vs Orders chart
  function renderCLVChart(data) {
    var clvVsOrdersChart = echarts.init(
      document.getElementById("clv-vs-orders")
    );

    var clvVsOrdersOption = {
      title: {
        text: "Scatter Plot of CLV vs. Number of Orders",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "value",
        name: "Number of Orders",
      },
      yAxis: {
        type: "value",
        name: "Customer Lifetime Value (CLV)",
      },
      series: [
        {
          symbolSize: 5,
          data: data,
          type: "scatter",
        },
      ],
    };

    clvVsOrdersChart.setOption(clvVsOrdersOption);
  }

  // Function to fetch data from the backend for price sensitivity
  function fetchPriceSensitivityData() {
    fetch("http://127.0.0.1:8000/price-sensitivity/")
      .then((response) => response.json())
      .then((data) => {
        var processedData = data.map((item) => [
          parseFloat(item.price),
          parseFloat(item.total_sales),
        ]);
        console.log("Processed Data for Price Sensitivity:", processedData); // Debugging line
        renderPriceSensitivityChart(processedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Function to render the price sensitivity chart
  function renderPriceSensitivityChart(data) {
    var scatterChart = echarts.init(
      document.getElementById("price-sensitivity-chart")
    );

    var scatterOption = {
      title: {
        text: "Price Sensitivity Analysis - Scatter Plot",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      xAxis: {
        type: "value",
        name: "Price ($)",
      },
      yAxis: {
        type: "value",
        name: "Total Sales ($)",
      },
      series: [
        {
          name: "Sales",
          type: "scatter",
          data: data,
        },
      ],
    };

    scatterChart.setOption(scatterOption);
  }

  // Fetch data and render the charts
  fetchCLVData();
  fetchPriceSensitivityData();
});

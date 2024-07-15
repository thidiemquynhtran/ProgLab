$(document).ready(function () {
  // Ingredient Usage Chart
  const ingredientUsageChart = echarts.init(
    document.getElementById("ingredientUsageChart")
  );

  $.ajax({
    url: "http://127.0.0.1:8000/ingredient-usage/",
    method: "GET",
    dataType: "json",
    success: function (data) {
      const ingredients = data.map((item) => item.ingredient);
      const usageCounts = data.map((item) => item.usage_count);
      const usagePercentages = data.map((item) => item.usage_percentage);

      const ingredientUsageOption = {
        title: {
          text: "Ingredient Usage Count",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (params) {
            let tooltipText = params[0].name + "<br>";
            params.forEach((item) => {
              tooltipText +=
                item.marker + item.seriesName + ": " + item.value + "<br>";
              if (item.seriesName === "Usage Count") {
                const index = ingredients.indexOf(item.name);
                tooltipText +=
                  "Usage Percentage: " + usagePercentages[index] + "%<br>";
              }
            });
            return tooltipText;
          },
        },
        xAxis: {
          type: "category",
          data: ingredients,
        },
        yAxis: {
          type: "value",
          name: "Usage Count",
        },
        series: [
          {
            name: "Usage Count",
            type: "bar",
            data: usageCounts,
            itemStyle: {
              color: "skyblue",
            },
          },
        ],
      };

      ingredientUsageChart.setOption(ingredientUsageOption);
    },
    error: function (error) {
      console.error("Error fetching data:", error);
    },
  });

  // Product Size Popularity Chart
  const productSizeChart = echarts.init(
    document.getElementById("productSizeChart")
  );

  $.ajax({
    url: "http://127.0.0.1:8000/product_size_popularity/",
    method: "GET",
    dataType: "json",
    success: function (response) {
      const sizes = [];
      const numberOfItems = [];
      const totalRevenue = [];

      response.forEach((item) => {
        sizes.push(item.product_size);
        numberOfItems.push(item.total_sales);
        totalRevenue.push(parseFloat(item.total_revenue));
      });

      const productSizeOption = {
        title: {
          text: "Product Size Popularity",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            let tooltipText = params[0].name + "<br>";
            params.forEach((item) => {
              tooltipText +=
                item.marker + item.seriesName + ": " + item.value + "<br>";
            });
            return tooltipText;
          },
        },
        grid: {
          left: "18%",
          right: "22%",
          bottom: "15%",
        },
        xAxis: {
          type: "category",
          data: sizes,
        },
        yAxis: [
          {
            type: "value",
            name: "Number of Items Sold",
            position: "left",
          },
          {
            type: "value",
            name: "Total Revenue ($)",
            position: "right",
            axisLabel: {
              formatter: "${value}",
            },
          },
        ],
        series: [
          {
            name: "Number of Items Sold",
            type: "bar",
            data: numberOfItems,
            itemStyle: {
              color: "rgba(54, 162, 235, 0.6)",
            },
          },
          {
            name: "Total Revenue ($)",
            type: "line",
            yAxisIndex: 1,
            data: totalRevenue,
            itemStyle: {
              color: "rgba(255, 99, 132, 1)",
            },
          },
        ],
      };

      productSizeChart.setOption(productSizeOption);
    },
    error: function (error) {
      console.log("Error fetching data:", error);
    },
  });
});

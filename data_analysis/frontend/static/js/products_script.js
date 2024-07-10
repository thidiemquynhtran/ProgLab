$(document).ready(function () {
  var barChart, pieChart;
  var selectedCategories = [];
  var selectedYear = null;
  var categoryColors = {}; // Mapping of category names to their colors

  function fetchBarChartData(year, callback) {
      $.ajax({
          url: `/total-sales-bar-data?year=${year}`,
          method: "GET",
          dataType: "json",
          success: function (data) {
              callback(data);
          },
          error: function (error) {
              console.error("Error fetching bar chart data", error);
          },
      });
  }

  function fetchPieChartData(year, month, callback) {
      $.ajax({
          url: `/pie-data`,
          method: "GET",
          data: { year: year, month: month },
          dataType: "json",
          success: function (data) {
              console.log("Pie chart data:", data);
              callback(data);
          },
          error: function (error) {
              console.error("Error fetching pie chart data", error);
          },
      });
  }

  function fetchMonthlySalesByCategory(year, category, callback) {
      $.ajax({
          url: `/monthly-sales-by-category`,
          method: "GET",
          data: { year: year, category: category },
          dataType: "json",
          success: function (data) {
              callback(data);
          },
          error: function (error) {
              console.error("Error fetching monthly sales by category", error);
          },
      });
  }

  function fetchIngredientUsage(callback) {
      $.ajax({
          url: "/ingredient-usage-data/",
          method: "GET",
          dataType: "json",
          success: function (data) {
              callback(data);
          },
          error: function (error) {
              console.error("Error fetching ingredient usage data", error);
          },
      });
  }

  function getFilteredData(year, callback) {
      fetchBarChartData(year, callback);
  }

  function createBarChart(filteredData, categorySalesData) {
      var months = filteredData.map((item) => item.month);
      var totalSalesData = filteredData.map((item) => parseFloat(item.revenue));

      var datasets = [
          {
              type: "line",
              label: "Total Sales",
              data: totalSalesData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: false,
          },
      ];

      if (categorySalesData) {
          categorySalesData.forEach((categoryData, index) => {
              var categorySales = categoryData.map((item) =>
                  parseFloat(item.revenue)
              );
              var categoryName = selectedCategories[index];
              var backgroundColor = categoryColors[categoryName];
              datasets.push({
                  type: "bar",
                  label: categoryName + " Sales",
                  data: categorySales,
                  backgroundColor: backgroundColor,
              });
          });
      }

      var ctx = document.getElementById("barChart").getContext("2d");
      if (barChart) {
          barChart.destroy();
      }
      barChart = new Chart(ctx, {
          type: "bar",
          data: {
              labels: months,
              datasets: datasets,
          },
          options: {
              onClick: function (evt) {
                  var activePoints = barChart.getElementsAtEventForMode(
                      evt,
                      "nearest",
                      { intersect: true },
                      false
                  );
                  if (activePoints.length) {
                      var month = barChart.data.labels[activePoints[0].index];
                      updatePieChart(month);
                  }
              },
              scales: {
                  y: {
                      beginAtZero: true,
                  },
              },
          },
      });
  }

  function createPieChart(filteredData, title) {
      var categories = Array.from(new Set(filteredData.map((item) => item.name)));
      var totalSales = filteredData.reduce((sum, item) => sum + item.revenue, 0);
      var data = categories.map((category, index) => {
          var categorySales = filteredData
              .filter((item) => item.name === category)
              .reduce((sum, item) => sum + item.revenue, 0);
          // Save the color for this category
          categoryColors[category] = pizzaColors[index % pizzaColors.length];
          return {
              value: ((categorySales / totalSales) * 100).toFixed(2),
              name: category,
              itemStyle: {
                  color: pizzaColors[index % pizzaColors.length],
              },
          };
      });

      var chartDom = document.getElementById("pieChart");
      var myChart = echarts.init(chartDom);
      var option = {
          title: {
              text: title,
              left: "center",
              top: 20,
          },
          tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
              orient: "horizontal",
              left: "left",
              bottom: 0,
              data: categories,
          },
          series: [
              {
                  name: "Sales",
                  type: "pie",
                  radius: "50%",
                  data: data,
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: "rgba(0, 0, 0, 0.5)",
                      },
                  },
                  label: {
                      show: true,
                      formatter: "{b}\n{d}%",
                      position: "outside",
                      alignTo: "labelLine",
                  },
                  labelLine: {
                      show: true,
                  },
              },
          ],
          color: pizzaColors,
      };

      myChart.setOption(option);

      myChart.on("click", function (params) {
          console.log("Pie chart clicked");
          if (selectedCategories.includes(params.name)) {
              return;
          }

          if (selectedCategories.length === 2) {
              selectedCategories.shift();
          }

          selectedCategories.push(params.name);
          console.log("Selected categories:", selectedCategories);
          updateBarChart();
      });
  }

  function updatePieChart(month) {
      var year = selectedYear;
      var title = `Category Distribution for ${year} ${month}`;
      fetchPieChartData(year, month, function (data) {
          createPieChart(data, title);
      });
  }

  function updateBarChart() {
      console.log("updateBarChart function called");

      var year = selectedYear;
      console.log("Selected year:", year);

      if (selectedCategories.length > 0) {
          var categorySalesData = [];
          var fetchCategoryData = function (index) {
              if (index < selectedCategories.length) {
                  fetchMonthlySalesByCategory(
                      year,
                      selectedCategories[index],
                      function (categoryData) {
                          categorySalesData.push(categoryData);
                          fetchCategoryData(index + 1);
                      }
                  );
              } else {
                  fetchBarChartData(year, function (totalData) {
                      createBarChart(totalData, categorySalesData);
                  });
              }
          };
          fetchCategoryData(0);
      } else {
          fetchBarChartData(year, function (data) {
              createBarChart(data, null);
          });
      }
  }

  function updateIngredientUsageChart(ingredientData) {
      var ingredientNames = ingredientData.map((item) => item.name);
      var ingredientUsage = ingredientData.map((item) => item.usage);

      var ctx = document.getElementById("ingredientUsageChart").getContext("2d");
      if (pieChart) {
          pieChart.destroy();
      }
      pieChart = new Chart(ctx, {
          type: "doughnut",
          data: {
              labels: ingredientNames,
              datasets: [
                  {
                      label: "Ingredient Usage",
                      data: ingredientUsage,
                      backgroundColor: pizzaColors.slice(0, ingredientNames.length),
                  },
              ],
          },
          options: {
              plugins: {
                  legend: {
                      position: "bottom",
                  },
              },
          },
      });
  }

  const pizzaColors = [
      "#4E79A7",
      "#F28E2B",
      "#E15759",
      "#76B7B2",
      "#59A14F",
      "#EDC948",
      "#B07AA1",
      "#FF9DA7",
      "#9C755F",
  ];

  $("#yearFilter").change(function () {
      selectedCategories = [];
      selectedYear = parseInt($(this).val());

      getFilteredData(selectedYear, function (data) {
          createBarChart(data);
      });

      fetchPieChartData(selectedYear, null, function (data) {
          var title = `Category Distribution for ${selectedYear}`;
          createPieChart(data, title);
      });

      fetchIngredientUsage(function (data) {
          updateIngredientUsageChart(data);
      });
  });

  // Initial load
  selectedYear = parseInt($("#yearFilter").val());

  getFilteredData(selectedYear, function (data) {
      createBarChart(data);
  });

  fetchPieChartData(selectedYear, null, function (data) {
      var title = `Category Distribution for ${selectedYear}`;
      createPieChart(data, title);
  });

  fetchIngredientUsage(function (data) {
      updateIngredientUsageChart(data);
  });
});

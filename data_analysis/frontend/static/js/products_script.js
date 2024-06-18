$(document).ready(function () {
  var barChart, pieChart;
  var selectedCategory = null;
  var selectedYear = null;

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

  function getFilteredData(year, callback) {
    fetchBarChartData(year, callback);
  }
  function createBarChart(filteredData, categorySalesData) {
    var months = filteredData.map((item) => item.month);
    var totalSalesData = filteredData.map((item) => parseFloat(item.revenue));

    var datasets = [
      {
        label: "Total Sales",
        data: totalSalesData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ];

    // Check if categorySalesData is provided and add a dataset for category sales
    if (categorySalesData) {
      var categorySales = categorySalesData.map((item) =>
        parseFloat(item.revenue)
      );
      var categoryNames = categorySalesData.map((item) => item.name);
      datasets.push({
        label: selectedCategory + " Sales",
        data: categorySales,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
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
      },
    });
  }

  function createPieChart(filteredData, title) {
    var categories = Array.from(new Set(filteredData.map((item) => item.name)));
    var totalSales = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    var data = categories.map((category) => {
      var categorySales = filteredData
        .filter((item) => item.name === category)
        .reduce((sum, item) => sum + item.revenue, 0);
      //return (categorySales / totalSales) * 100;
      return {
        value: ((categorySales / totalSales) * 100).toFixed(2),
        name: category,
      };
    });

    // Calculate the total Revenue (in numbers not percentage) for each category
    // var data = categories.map((category) => {
    //   var categorySales = filteredData
    //     .filter((item) => item.name === category)
    //     .reduce((sum, item) => sum + item.Revenue, 0);
    //   return categorySales;
    // });

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
      selectedCategory = params.name;
      console.log("Selected category:", selectedCategory);
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

    if (selectedCategory) {
      console.log("Selected category:", selectedCategory);
      fetchMonthlySalesByCategory(
        year,
        selectedCategory,
        function (categoryData) {
          console.log("Monthly sales data for category:", categoryData);
          fetchBarChartData(year, function (totalData) {
            console.log("Bar chart data:", totalData);
            createBarChart(totalData, categoryData); // Pass both total sales data and category sales data to createBarChart
          });
        }
      );
    } else {
      console.log("No category selected");
      fetchBarChartData(year, function (data) {
        console.log("Bar chart data:", data);
        createBarChart(data, null);
      });
    }
  }
  
  const pizzaColors = [
    "#4E79A7", // Blue
    "#F28E2B", // Orange
    "#E15759", // Red
    "#76B7B2", // Teal
    "#59A14F", // Green
    "#EDC948", // Yellow
    "#B07AA1", // Purple
    "#FF9DA7", // Pink
    "#9C755F", // Brown
  ];

  $("#yearFilter").change(function () {
    selectedCategory = null;
    selectedYear = parseInt($(this).val());

    getFilteredData(selectedYear, function (data) {
      createBarChart(data);
    });

    fetchPieChartData(selectedYear, null, function (data) {
      var title = `Category Distribution for ${selectedYear}`;
      createPieChart(data,title);
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
});

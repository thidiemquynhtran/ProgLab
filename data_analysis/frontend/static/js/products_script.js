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
    var totalSalesData = filteredData.map((item) =>
      parseFloat(item.revenue)
    );

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

  function createPieChart(filteredData) {
    var categories = Array.from(new Set(filteredData.map((item) => item.name)));
    var totalSales = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    var data = categories.map((category) => {
      var categorySales = filteredData
        .filter((item) => item.name === category)
        .reduce((sum, item) => sum + item.revenue, 0);
      return (categorySales / totalSales) * 100;
    });

    // Calculate the total Revenue (in numbers not percentage) for each category
    // var data = categories.map((category) => {
    //   var categorySales = filteredData
    //     .filter((item) => item.name === category)
    //     .reduce((sum, item) => sum + item.Revenue, 0);
    //   return categorySales;
    // });

    var ctx = document.getElementById("pieChart").getContext("2d");
    if (pieChart) {
      pieChart.destroy();
    }
    pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: categories,
        datasets: [
          {
            data: data,
            backgroundColor: categories.map(() => getRandomColor()),
          },
        ],
      },
      options: {
        onClick: function (evt) {
          console.log("Pie chart clicked");
          var activePoints = pieChart.getElementsAtEventForMode(
            evt,
            "nearest",
            { intersect: true },
            false
          );
          if (activePoints.length) {
            selectedCategory = pieChart.data.labels[activePoints[0].index];
            console.log("Selected category:", selectedCategory);
            updateBarChart();
          }
        },
      },
    });
  }

  function updatePieChart(month) {
    var year = selectedYear;
    fetchPieChartData(year, month, function (data) {
      createPieChart(data);
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

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  $("#yearFilter").change(function () {
    selectedCategory = null;
    selectedYear = parseInt($(this).val());

    getFilteredData(selectedYear, function (data) {
      createBarChart(data);
    });

    fetchPieChartData(selectedYear, null, function (data) {
      createPieChart(data);
    });
  });

  // Initial load
  selectedYear = parseInt($("#yearFilter").val());

  getFilteredData(selectedYear, function (data) {
    createBarChart(data);
  });

  fetchPieChartData(selectedYear, null, function (data) {
    createPieChart(data);
  });
});

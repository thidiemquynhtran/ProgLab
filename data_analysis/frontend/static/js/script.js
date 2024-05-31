$(document).ready(function () {
  var barChart, pieChart;
  var selectedCategory = null;
  var selectedYear = null;

  function fetchBarChartData(year, callback) {
    $.ajax({
      url: `/total-sales-by-month?year=${year}`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        console.log("Bar chart data:", data);
        callback(data);
      },
      error: function (error) {
        console.error("Error fetching bar chart data", error);
      },
    });
  }

  function fetchPieChartData(year, month, callback) {
    // $.ajax({
    //   url: `/pizza-category-distribution?year=${year}&month=${month}`,
    //   method: "GET",
    //   dataType: "json",
    //   success: function (data) {
    //     callback(data);
    //   },
    //   error: function (error) {
    //     console.error("Error fetching pie chart data", error);
    //   },
    // });
    // Modify the URL to include the year and month as query parameters
    $.ajax({
      url: `/pizza-category-distribution`,
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

  function getFilteredData(year, callback) {
    fetchBarChartData(year, callback);
  }

  function createBarChart(filteredData) {
    var months = filteredData.map((item) => item.month);
    var totalSalesData = filteredData.map((item) =>
      parseFloat(item.total_sales)
    );

    var datasets = [
      {
        label: "Total Sales",
        data: totalSalesData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ];

    if (selectedCategory) {
      var categorySalesData = months.map((month) => {
        if (selectedCategory) {
          var entry = filteredData.find(
            (item) => item.month === month && item.category === selectedCategory
          );
          return entry ? entry.sales : 0;
        } else {
          return 0;
        }
      });

      datasets.push({
        label: selectedCategory + " Sales",
        data: categorySalesData,
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
    var categories = filteredData.map((item) => item.name);

    //var data = filteredData.map((item) => item.Revenue);

    //Calculate the total sales
    var totalSales = filteredData.reduce((sum, item) => sum + item.Revenue, 0);

    // Calculate the percentage of total revenue for each category
    var data = categories.map((category) => {
      var categorySales = filteredData
        .filter((item) => item.name === category)
        .reduce((sum, item) => sum + item.Revenue, 0);
      return (categorySales / totalSales) * 100;
    });

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
          var activePoints = pieChart.getElementsAtEventForMode(
            evt,
            "nearest",
            { intersect: true },
            false
          );
          if (activePoints.length) {
            selectedCategory = pieChart.data.labels[activePoints[0].index];
            updateBarChart();
          }
        },
      },
    });
  }

  function updatePieChart(month) {
    // Fetch the selected year from the dropdown
    var year = selectedYear;
    fetchPieChartData(year, month, function (data) {
      createPieChart(data);
    });
  }

  function updateBarChart() {
    // Fetch the selected year from the dropdown
    var year = selectedYear;
    getFilteredData(year, function (data) {
      createBarChart(data);
    });
  }

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // $("#yearFilter").change(function () {
  //   selectedCategory = null;
  //   var year = parseInt($(this).val());

  //   getFilteredData(year, function (data) {
  //     createBarChart(data);
  //     createPieChart(data);
  //   });
  // });
  $("#yearFilter").change(function () {
    // Update the selected year when the dropdown value changes
    selectedYear = parseInt($(this).val());

    // Update both charts with the filtered data for the selected year
    getFilteredData(selectedYear, function (data) {
      createBarChart(data);
      createPieChart(data);
    });
  });

  // Initially load the data for the default year
  selectedYear = parseInt($("#yearFilter").val());
  getFilteredData(selectedYear, function (data) {
    createBarChart(data);
    createPieChart(data);
  });
});

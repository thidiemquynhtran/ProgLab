$(document).ready(function () {
  var barChart, pieChart;
  var selectedCategory = null;

  var data = [
    { month: "January", category: "Pepperoni", sales: 100, year: 2023 },
    { month: "January", category: "Margarita", sales: 120, year: 2023 },
    { month: "January", category: "Hawaiian", sales: 80, year: 2023 },
    { month: "January", category: "Meat Lover", sales: 150, year: 2023 },
    { month: "January", category: "Veggie", sales: 90, year: 2023 },
    { month: "January", category: "BBQ Chicken", sales: 110, year: 2023 },
    { month: "January", category: "Buffalo Chicken", sales: 70, year: 2023 },
    { month: "January", category: "Sicillian", sales: 130, year: 2023 },
    { month: "January", category: "Oxtail", sales: 140, year: 2023 },
    { month: "February", category: "Pepperoni", sales: 110, year: 2023 },
    { month: "February", category: "Margarita", sales: 130, year: 2023 },
    { month: "February", category: "Hawaiian", sales: 90, year: 2023 },
    { month: "February", category: "Meat Lover", sales: 160, year: 2023 },
    { month: "February", category: "Veggie", sales: 100, year: 2023 },
    { month: "February", category: "BBQ Chicken", sales: 120, year: 2023 },
    { month: "February", category: "Buffalo Chicken", sales: 80, year: 2023 },
    { month: "February", category: "Sicillian", sales: 140, year: 2023 },
    { month: "February", category: "Oxtail", sales: 150, year: 2023 },
    // Add more data as needed
  ];

  function getFilteredData(year) {
    return data.filter((item) => item.year === year);
  }

  function createBarChart(filteredData) {
    //get all unique months
    var months = [...new Set(filteredData.map((item) => item.month))];

    var totalSalesData = months.map((month) => {
      return filteredData
        .filter((item) => item.month === month)
        .reduce((sum, item) => sum + item.sales, 0);
    });

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

    var datasets = [
      {
        label: "Total Sales",
        data: totalSalesData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ];

    if (selectedCategory) {
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
    var categories = [...new Set(filteredData.map((item) => item.category))];
    var totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);

    var data = categories.map((category) => {
      var categorySales = filteredData
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.sales, 0);
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
    var year = parseInt($("#yearFilter").val());
    var filteredData = getFilteredData(year).filter(
      (item) => item.month === month
    );
    createPieChart(filteredData);
  }

  function updateBarChart() {
    var year = parseInt($("#yearFilter").val());
    var filteredData = getFilteredData(year);
    createBarChart(filteredData);
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
    var year = parseInt($(this).val());
    var filteredData = getFilteredData(year);
    createBarChart(filteredData);
    createPieChart(filteredData);
  });

  var initialYear = parseInt($("#yearFilter").val());
  var initialData = getFilteredData(initialYear);
  createBarChart(initialData);
  createPieChart(initialData);
});

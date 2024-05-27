$(document).ready(function () {
  var barChart, pieChart;
  var selectedCategory = null;
  var allData = []; // Variable to store all data fetched

  // function getFilteredData(year) {
  //   return data.filter((item) => item.year === year);
  // }

   function getFilteredData(data, year) {
     return data.filter((item) => item.year === year);
   }
  function fetchData() {
    // Fetch total customers and average order value
    $.ajax({
      url: "http://127.0.0.1:8000/total-customers/", // Update with your actual endpoint URL
      method: "GET",
      success: function (response) {
        $("#totalCustomers").text(response.total_customers);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching total customers data:", error);
        // Handle error case here
      },
    });

    // Fetch average order value
    $.ajax({
      url: "http://127.0.0.1:8000/average-order-value/", // Update with your actual endpoint URL
      method: "GET",
      success: function (response) {
        $("#averageOrderValue").text(response.average_order_value);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching average order value data:", error);
        // Handle error case here
      },
    });

    // Fetch data for bar chart
    $.ajax({
      url: "http://127.0.0.1:8000/total-sales-by-month/",
      method: "GET",
      success: function (response) {
        console.log("Bar Chart Response Data:", response);
        if (Array.isArray(response)) {
          allData = response; // Store the fetched data
          var initialYear = parseInt($("#yearFilter").val());
          var initialData = getFilteredData(allData, initialYear);
          createBarChart(initialData);
        } else {
          console.error("Error: Data is not an array.");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching bar chart data:", error);
      },
    });

    // Fetch data for pie chart
    // $.ajax({
    //   url: "http://127.0.0.1:8000/pizza-category-distribution/",
    //   method: "GET",
    //   success: function (response) {
    //     //createPieChart(response.data);
    //   },
    //   error: function (xhr, status, error) {
    //     console.error("Error fetching pie chart data:", error);
    //   },
    // });
  }

  function createBarChart(filteredData) {
    // Get all unique months
    var months = [...new Set(filteredData.map((item) => item.month))];

    var totalSalesData = months.map((month) => {
      return filteredData
        .filter((item) => item.month === month)
        .reduce((sum, item) => sum + parseFloat(item.total_sales), 0);
    });

    var ctx = document.getElementById("barChart").getContext("2d");
    if (barChart) {
      barChart.destroy();
    }
    barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Total Sales",
            data: totalSalesData,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ],
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
            //updatePieChart(month);
          }
        },
      },
    });
  }

  // function createPieChart(filteredData) {
  //   var categories = [...new Set(filteredData.map((item) => item.category))];
  //   var totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);

  //   var data = categories.map((category) => {
  //     var categorySales = filteredData
  //       .filter((item) => item.category === category)
  //       .reduce((sum, item) => sum + item.sales, 0);
  //     return (categorySales / totalSales) * 100;
  //   });

  //   var ctx = document.getElementById("pieChart").getContext("2d");
  //   if (pieChart) {
  //     pieChart.destroy();
  //   }
  //   pieChart = new Chart(ctx, {
  //     type: "pie",
  //     data: {
  //       labels: categories,
  //       datasets: [
  //         {
  //           data: data,
  //           backgroundColor: categories.map(() => getRandomColor()),
  //         },
  //       ],
  //     },
  //     options: {
  //       onClick: function (evt) {
  //         var activePoints = pieChart.getElementsAtEventForMode(
  //           evt,
  //           "nearest",
  //           { intersect: true },
  //           false
  //         );
  //         if (activePoints.length) {
  //           selectedCategory = pieChart.data.labels[activePoints[0].index];
  //           updateBarChart();
  //         }
  //       },
  //     },
  //   });
  // }

  // function updatePieChart(month) {
  //   var year = parseInt($("#yearFilter").val());
  //   var filteredData = getFilteredData(year).filter(
  //     (item) => item.month === month
  //   );
  //   createPieChart(filteredData);
  // }

  // function updateBarChart() {
  //   var year = parseInt($("#yearFilter").val());
  //   var filteredData = getFilteredData(year);
  //   createBarChart(filteredData);
  // }

  // function getRandomColor() {
  //   var letters = "0123456789ABCDEF";
  //   var color = "#";
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }

  // Initialize fetchData when document is ready
  fetchData();

  $("#yearFilter").change(function () {
    selectedCategory = null;
    var year = parseInt($(this).val());
    var filteredData = getFilteredData(allData, year); // Pass allData and year
    createBarChart(filteredData);
    //createPieChart(filteredData);
  });

  // var initialYear = parseInt($("#yearFilter").val());
  // var initialData = getFilteredData(initialYear);
  // createBarChart(initialData);
  // createPieChart(initialData);

  // // Call fetchData function when document is ready
});

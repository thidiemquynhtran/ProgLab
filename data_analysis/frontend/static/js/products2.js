$(document).ready(function () {
  const ctx = document.getElementById("ingredientUsageChart").getContext("2d");

  $.ajax({
    url: "http://127.0.0.1:8000/ingredient-usage/",
    method: "GET",
    dataType: "json",
    success: function (data) {
      const ingredients = data.map((item) => item.ingredient);
      const usageCounts = data.map((item) => item.usage_count);
      const usagePercentages = data.map((item) => item.usage_percentage);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ingredients,
          datasets: [
            {
              label: "Usage Count",
              data: usageCounts,
              backgroundColor: "skyblue",
              borderColor: "blue",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                autoSkip: false,
              },
            },
            y: {
              beginAtZero: true,
              position: "left",
              title: {
                display: true,
                text: "Usage Count",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Ingredient Usage Count",
            },
            tooltip: {
              callbacks: {
                afterLabel: function (tooltipItem) {
                  const index = tooltipItem.dataIndex;
                  return "Usage Percentage: " + usagePercentages[index] + "%";
                },
              },
            },
          },
        },
      });
    },
    error: function (error) {
      console.error("Error fetching data:", error);
    },
  });
});

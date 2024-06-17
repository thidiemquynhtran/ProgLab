let lineChart;
let barChart;
let pieChart;

function updateDashboard(year) {
  const data = {
    2020: {
      totalCustomers: 1000,
      repeatCustomers: 300,
      repeatPurchaseRate: 30,
      monthlyData: [100, 150, 130, 140, 180, 170, 160, 150, 140, 130, 120, 110],
      repeatMonthlyData: [30, 50, 40, 45, 50, 60, 55, 50, 45, 40, 35, 30],
      quarterlyData: [28, 30, 32, 34],
      segmentData: [50, 30, 20],
    },
    2021: {
      totalCustomers: 1200,
      repeatCustomers: 400,
      repeatPurchaseRate: 33,
      monthlyData: [110, 160, 140, 150, 190, 180, 170, 160, 150, 140, 130, 120],
      repeatMonthlyData: [33, 55, 45, 50, 55, 65, 60, 55, 50, 45, 40, 33],
      quarterlyData: [30, 32, 34, 36],
      segmentData: [55, 35, 10],
    },
    2022: {
      totalCustomers: 1300,
      repeatCustomers: 450,
      repeatPurchaseRate: 34,
      monthlyData: [120, 170, 150, 160, 200, 190, 180, 170, 160, 150, 140, 130],
      repeatMonthlyData: [36, 60, 50, 55, 60, 70, 65, 60, 55, 50, 45, 36],
      quarterlyData: [32, 34, 36, 38],
      segmentData: [60, 30, 10],
    },
  };

  const selectedData = data[year];

  document.getElementById("totalCustomers").innerText =
    selectedData.totalCustomers;
  document.getElementById("repeatCustomers").innerText =
    selectedData.repeatCustomers;
  document.getElementById("repeatPurchaseRate").innerText =
    selectedData.repeatPurchaseRate + "%";

  lineChart.data.datasets[0].data = selectedData.monthlyData;
  lineChart.data.datasets[1].data = selectedData.repeatMonthlyData;
  lineChart.update();

  barChart.data.datasets[0].data = selectedData.quarterlyData;
  barChart.update();

  pieChart.data.datasets[0].data = selectedData.segmentData;
  pieChart.update();
}

document.addEventListener("DOMContentLoaded", function () {
  const ctxLine = document.getElementById("lineChart").getContext("2d");
  lineChart = new Chart(ctxLine, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Total Customers",
          data: [],
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        },
        {
          label: "Repeat Customers",
          data: [],
          fill: true,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          pointBackgroundColor: "rgba(153, 102, 255, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(153, 102, 255, 1)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 250,
        },
      },
    },
  });

  const ctxBar = document.getElementById("barChart").getContext("2d");
  barChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Repeat Purchase Rate",
          data: [],
          backgroundColor: ["#4E73DF", "#4E73DF", "#4E73DF", "#4E73DF"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 40,
        },
      },
    },
  });

  const ctxPie = document.getElementById("pieChart").getContext("2d");
  pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: ["Top 10% Customers", "Top 11-20% Customers", "Others"],
      datasets: [
        {
          data: [],
          backgroundColor: ["#1cc88a", "#36b9cc", "#e74a3b"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // Initialize with default year data
  updateDashboard(2020);
});

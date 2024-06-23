let lineChart;
let barChart;
let pieChart;

function updateDashboard(year) {
  $.ajax({
    url: `/api/year-tc-rc-rpr/`,
    method: "GET",
    success: function (data) {
      const yearData = data.find((item) => item.year === year);
      if (yearData) {
        document.getElementById("totalCustomers").innerText =
          yearData.total_customers;
        document.getElementById("repeatCustomers").innerText =
          yearData.repeat_customers;
        document.getElementById("repeatPurchaseRate").innerText =
          yearData.repeat_purchase_rate + "%";
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(
        "Error fetching total customers and repeat customers:",
        textStatus,
        errorThrown
      );
    },
  });

  $.ajax({
    url: `/monthly-rpr/${year}/`,
    method: "GET",
    success: function (monthlyData) {
      const months = monthlyData.map((item) => item.month);
      const totalCustomers = monthlyData.map((item) => item.total_customers);
      const repeatCustomers = monthlyData.map((item) => item.repeat_customers);
      const repeatPurchaseRate = monthlyData.map((item) =>
        parseFloat(item.repeat_purchase_rate)
      );

      lineChart.setOption({
        xAxis: { data: months },
        series: [{ data: totalCustomers }, { data: repeatCustomers }],
      });

      barChart.setOption({
        xAxis: { data: months },
        series: [{ data: repeatPurchaseRate }],
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching monthly data:", textStatus, errorThrown);
    },
  });

  $.ajax({
    url: `/revenue-segments/${year}/`,
    method: "GET",
    success: function (segmentData) {
      const segmentLabels = [
        "Top 10% Customers",
        "Top 11-20% Customers",
        "Others",
      ];
      const segmentRevenues = segmentData.map((item) => item.segment_revenue);
      const totalRevenue = segmentRevenues.reduce((a, b) => a + b, 0);

      pieChart.setOption({
        series: [
          {
            data: segmentLabels.map((label, index) => ({
              value: segmentRevenues[index],
              name: label,
              percent: ((segmentRevenues[index] / totalRevenue) * 100).toFixed(
                2
              ), // Calculate percentage
            })),
          },
        ],
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(
        "Error fetching revenue segments:",
        textStatus,
        errorThrown
      );
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const lineChartDom = document.getElementById("lineChart");
  const barChartDom = document.getElementById("barChart");
  const pieChartDom = document.getElementById("pieChart");

  lineChart = echarts.init(lineChartDom);
  barChart = echarts.init(barChartDom);
  pieChart = echarts.init(pieChartDom);

  lineChart.setOption({
    title: { text: "Monthly Data" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Total Customers", "Repeat Customers"] },
    xAxis: {
      type: "category",
      data: [], // Initialize with empty data, will be set by AJAX response
    },
    yAxis: { type: "value" },
    series: [
      { name: "Total Customers", type: "line", data: [], areaStyle: {} },
      { name: "Repeat Customers", type: "line", data: [], areaStyle: {} },
    ],
  });

  barChart.setOption({
    title: { text: "Monthly Repeat Purchase Rate" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: [], // Initialize with empty data, will be set by AJAX response
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Repeat Purchase Rate",
        type: "bar",
        data: [],
        itemStyle: { color: "#4E73DF" },
      },
    ],
  });

  pieChart.setOption({
    title: { text: "Customer Segments by Sales", left: "center" },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return `${params.name}: ${params.value} $`;
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      bottom: 0,
    },
    series: [
      {
        name: "Segments",
        type: "pie",
        radius: "50%",
        data: [
          { value: 0, name: "Top 10% Customers" },
          { value: 0, name: "Top 11-20% Customers" },
          { value: 0, name: "Others" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          formatter: function (params) {
            return `${params.name}: ${params.percent}%`;
          },
        },
      },
    ],
  });

  // Initialize with default year data
  // updateDashboard(new Date().getFullYear());
  // Initialize with 2020 data
  updateDashboard(2020);
});

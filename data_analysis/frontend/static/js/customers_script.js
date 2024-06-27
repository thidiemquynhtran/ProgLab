let combinedChart;
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

      combinedChart.setOption({
        xAxis: { data: months },
        series: [
          {
            name: "Total Customers",
            type: "bar",
            stack: "customers",
            data: totalCustomers,
          },
          {
            name: "Repeat Customers",
            type: "bar",
            stack: "customers",
            data: repeatCustomers,
          },
          {
            name: "Repeat Purchase Rate",
            type: "line",
            data: repeatPurchaseRate,
            yAxisIndex: 1,
            smooth: true,
          },
        ],
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
  const combinedChartDom = document.getElementById("combinedChart");
  const pieChartDom = document.getElementById("pieChart");

  combinedChart = echarts.init(combinedChartDom);
  pieChart = echarts.init(pieChartDom);

  combinedChart.setOption({
    title: { text: "Monthly Data" },
    tooltip: { trigger: "axis" },
    legend: {
      data: ["Total Customers", "Repeat Customers", "Repeat Purchase Rate"],
    },
    xAxis: {
      type: "category",
      data: [], // Initialize with empty data, will be set by AJAX response
    },
    yAxis: [
      { type: "value", name: "Customers" },
      {
        type: "value",
        name: "Repeat Purchase Rate (%)",
        position: "right",
        axisLabel: { formatter: "{value}%" },
      },
    ],
    series: [
      { name: "Total Customers", type: "bar", stack: "customers", data: [] },
      { name: "Repeat Customers", type: "bar", stack: "customers", data: [] },
      {
        name: "Repeat Purchase Rate",
        type: "line",
        data: [],
        yAxisIndex: 1,
        smooth: true,
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

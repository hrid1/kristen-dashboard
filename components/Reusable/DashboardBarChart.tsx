/** @format */

"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* TYPES */

type MonthlyStats = {
  month: string;
  users: number;
  activeSubscriptions: number;
  revenue: number;
};

type DashboardBarChartProps = {
  chartData: MonthlyStats[];
};

/*  COMPONENT  */

const DashboardBarChart = ({ chartData = [] }: DashboardBarChartProps) => {
  // X-axis labels (months)
  const categories = chartData.map(item => item.month);

  // Bar values (you can change users → revenue / activeSubscriptions)
  const seriesData = chartData.map(item => item.revenue);

  const series = [
    {
      name: "Revenue",
      data: seriesData,
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#C6A664"],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 16,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#C6A664",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val}`,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-[#C6A66480] bg-white p-4">
      <h1 className="text-[#1D1F2C] text-base md:text-xl font-semibold leading-[130%] pl-5">Revenue Performance</h1>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default DashboardBarChart;

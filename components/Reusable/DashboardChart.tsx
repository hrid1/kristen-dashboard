"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* ================= TYPES ================= */

type MonthlyData = {
  month: string;
  users: number;
  premiumUsers: number;
  freeUsers: number;
  activeSubscriptions: number;
  revenue: number;
};

type DashboardChartProps = {
  chartData: {
    currentYear: MonthlyData[];
    lastYear: MonthlyData[];
  };
};

/* ================= COMPONENT ================= */

const DashboardChart = ({ chartData }: DashboardChartProps) => {
  const currentYear = chartData?.currentYear ?? [];
  const lastYear = chartData?.lastYear ?? [];

  const categories = currentYear.map(item => item.month);

  const series = [
    {
      name: "Current Year - Premium Users",
      data: currentYear.map(item => item.premiumUsers),
    },
    {
      name: "Current Year - Free Users",
      data: currentYear.map(item => item.freeUsers),
    },
    {
      name: "Last Year - Premium Users",
      data: lastYear.map(item => item.premiumUsers),
    },
    {
      name: "Last Year - Free Users",
      data: lastYear.map(item => item.freeUsers),
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "area",
      toolbar: { show: false },
    },
    colors: ["#C6A664", "#8E8E93", "#C6A66480", "#8E8E9380"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  return (
    <div className="rounded-2xl border border-[#C6A66480] bg-white p-4">
      <h1 className="text-[#1D1F2C] text-base md:text-xl font-semibold leading-[130%] pl-2">
        User Growth (Current vs Last Year)
      </h1>

      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default DashboardChart;

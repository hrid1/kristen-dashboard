"use client";

import { Users, FileText, DollarSign } from "lucide-react";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number | undefined;
  badge: string;
  badgeColor?: "green" | "red";
}

export interface DashboardStats {
  timeframe: string;
  label: string;
  range: {
    start: string;
    end: string;
  };
  metrics: {
    totalUsers: number;
    activeSubscriptions: number;
    revenue: number;
    totalRevPercentage: string;
  };
}

const MetricCard = ({
  icon,
  title,
  value,
  badge,
  badgeColor = "green",
}: MetricCardProps) => {
  const badgeStyles = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="relative rounded-2xl border border-[#C6A66480] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3EF]">
            <div className="text-[#C6A664]">{icon}</div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">{title}</span>
            <span className="mt-1 text-2xl font-bold text-gray-900">
              {value ? value : 0}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${badgeColor === "green" ? badgeStyles.green : badgeStyles.red
            }`}
        >
          {badge}
        </span>
      </div>
    </div>
  );
};

export default function KeyMetrics({ data }: { data: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <MetricCard
        icon={<Users className="h-6 w-6" />}
        title="Total Users"
        value={data?.metrics?.totalUsers}
        badge={data?.label}
        badgeColor="green"
      />
      <MetricCard
        icon={<FileText className="h-6 w-6" />}
        title="Active Subscriptions"
        value={data?.metrics?.activeSubscriptions}
        badge={data?.label}
        badgeColor="green"
      />
      <MetricCard
        icon={<DollarSign className="h-6 w-6" />}
        title="Monthly Revenue"
        value={`$${data?.metrics?.revenue ?? 0}`}
        badge={data?.metrics?.totalRevPercentage}
        badgeColor={
          data?.metrics?.totalRevPercentage?.startsWith("-")
            ? "red"
            : "green"
        }
      />

    </div>
  );
}

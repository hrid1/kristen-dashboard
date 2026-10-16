import ReportTabs from "@/components/Dashboard/Report/ReportTabs";
import { RenderPortal } from "@/components/Reusable/RenderPortal";
import Loading from "@/components/Reusable/Loading";
import React, { Suspense } from "react";

export default function ReportPage() {
  return (
    <div>
      <RenderPortal elementId="header-title">Report</RenderPortal>
      <Suspense fallback={<Loading text="Loading reports..." className="py-12" />}>
        <ReportTabs />
      </Suspense>
    </div>
  );
}


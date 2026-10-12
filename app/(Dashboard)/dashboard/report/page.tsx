import ReportTabs from "@/components/Dashboard/Report/ReportTabs";
import { RenderPortal } from "@/components/Reusable/RenderPortal";
import React, { Suspense } from "react";

export default function ReportPage() {
  return (
    <div>
      <RenderPortal elementId="header-title">Report</RenderPortal>
      <Suspense fallback={<div className="p-6 text-muted-foreground text-sm">Loading...</div>}>
        <ReportTabs />
      </Suspense>
    </div>
  );
}


import SubscriptionTabs from "@/components/Dashboard/Subscription/SubscriptionTabs";
import { RenderPortal } from "@/components/Reusable/RenderPortal";
import React, { Suspense } from "react";

export default function SubscriptionPage() {
  return (
    <div>
      <RenderPortal elementId="header-title">Subscription</RenderPortal>
      <Suspense fallback={<div className="p-6 text-muted-foreground text-sm">Loading...</div>}>
        <SubscriptionTabs />
      </Suspense>
    </div>
  );
}


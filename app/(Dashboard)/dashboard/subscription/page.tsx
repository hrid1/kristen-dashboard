import SubscriptionTabs from "@/components/Dashboard/Subscription/SubscriptionTabs";
import { RenderPortal } from "@/components/Reusable/RenderPortal";
import Loading from "@/components/Reusable/Loading";
import React, { Suspense } from "react";

export default function SubscriptionPage() {
  return (
    <div>
      <RenderPortal elementId="header-title">Subscription</RenderPortal>
      <Suspense fallback={<Loading text="Loading subscriptions..." className="py-12" />}>
        <SubscriptionTabs />
      </Suspense>
    </div>
  );
}


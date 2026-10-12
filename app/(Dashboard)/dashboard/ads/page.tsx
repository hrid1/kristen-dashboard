"use client";

import { RenderPortal } from "@/components/Reusable/RenderPortal";

export default function AdsPage() {
  return (
    <div className="p-6">
      <RenderPortal elementId="header-title">Ads</RenderPortal>
      <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
        <h2 className="text-xl font-semibold mb-2">Advertisements</h2>
        <p className="text-muted-foreground text-sm">
          Create and manage ad campaigns, placements, and sponsor promotions.
        </p>
      </div>
    </div>
  );
}


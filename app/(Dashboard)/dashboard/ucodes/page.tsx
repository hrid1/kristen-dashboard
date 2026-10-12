"use client";

import { RenderPortal } from "@/components/Reusable/RenderPortal";

export default function UcodesPage() {
  return (
    <div className="p-6">
      <RenderPortal elementId="header-title">Ucodes</RenderPortal>
      <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
        <h2 className="text-xl font-semibold mb-2">Ucodes</h2>
        <p className="text-muted-foreground text-sm">
          Generate, distribute, and track promo codes and discount vouchers.
        </p>
      </div>
    </div>
  );
}


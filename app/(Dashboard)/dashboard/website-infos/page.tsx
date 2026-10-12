"use client";

import { RenderPortal } from "@/components/Reusable/RenderPortal";

export default function WebsiteInfosPage() {
  return (
    <div className="p-6">
      <RenderPortal elementId="header-title">Website Infos</RenderPortal>
      <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
        <h2 className="text-xl font-semibold mb-2">Website Infos</h2>
        <p className="text-muted-foreground text-sm">
          Manage website content information, metadata, and public site configurations.
        </p>
      </div>
    </div>
  );
}


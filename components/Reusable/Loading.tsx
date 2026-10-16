"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
}

const sizeMap = {
  xs: "w-3.5 h-3.5 border-2",
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-3",
  xl: "w-16 h-16 border-4",
};

export function Spinner({ size = "md", className, color }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full animate-spin border-solid border-t-transparent",
        sizeMap[size] || sizeMap.md,
        !color && "border-[#C6A664] border-t-transparent",
        className
      )}
      style={color ? { borderColor: color, borderTopColor: "transparent" } : undefined}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export interface LoadingProps {
  text?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "inline" | "page" | "card" | "table";
  colSpan?: number;
}

export default function Loading({
  text = "Loading...",
  size = "md",
  className,
  variant = "inline",
  colSpan = 1,
}: LoadingProps) {
  // Variant: table row
  if (variant === "table") {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <Spinner size={size} />
            {text && (
              <p className="text-xs font-medium text-muted-foreground animate-pulse">
                {text}
              </p>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // Variant: full page / section
  if (variant === "page") {
    return (
      <div
        className={cn(
          "min-h-[50vh] w-full flex flex-col items-center justify-center gap-4 p-8",
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full bg-[#C6A664]/10 animate-ping" />
          <Spinner size="lg" />
        </div>
        {text && (
          <p className="text-sm font-medium text-gray-600 tracking-wide animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Variant: card container
  if (variant === "card") {
    return (
      <div
        className={cn(
          "w-full rounded-xl border border-border bg-white p-8 flex flex-col items-center justify-center gap-3 shadow-xs",
          className
        )}
      >
        <Spinner size={size} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse font-medium">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Variant: default inline
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 gap-3 w-full",
        className
      )}
    >
      <Spinner size={size} />
      {text && (
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}


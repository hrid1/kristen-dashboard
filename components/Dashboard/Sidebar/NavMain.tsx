"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface NavMainProps {
  currentPath: string;
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}

export function NavMain({ items: groupLabels, currentPath }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {groupLabels.map((groupLabel) => (
          <SidebarMenuItem key={groupLabel.title}>
            <SidebarMenuButton
              isActive={
                groupLabel.url === "/dashboard"
                  ? currentPath === "/dashboard"
                  : currentPath === groupLabel.url ||
                    currentPath.startsWith(`${groupLabel.url}/`)
              }
              asChild
              tooltip={groupLabel.title}
            >
              <Link href={groupLabel.url}>
                {groupLabel.icon && groupLabel.icon}
                <span>{groupLabel.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

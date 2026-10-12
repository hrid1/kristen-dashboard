/** @format */

"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import AnalyticsIcon from "@/components/icons/AnalyticsIcon";
import ContentManagementIcon from "@/components/icons/ContentManagementIcon";
import MurmurationIcon from "@/components/icons/MurmurationIcon";
import OverviewIcon from "@/components/icons/OverviewIcon";
import PaymentsIcon from "@/components/icons/PaymentsIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import UserManagementIcon from "@/components/icons/UserManagementIcon";
import UserReportIcon from "@/components/icons/UserReportIcon";
import UserSubscriptionIcon from "@/components/icons/UserSubscriptionIcon";
import WebsiteInfosIcon from "@/components/icons/WebsiteInfosIcon";
import AdsIcon from "@/components/icons/AdsIcon";
import UcodesIcon from "@/components/icons/UcodesIcon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavMain } from "./NavMain";
import { removeToken } from "@/hooks/token";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <OverviewIcon />,
    },
    // {
    //   title: "Analytics",
    //   url: "/dashboard/analytics",
    //   icon: <AnalyticsIcon />,
    // },
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: <UserManagementIcon />,
    },
    {
      title: "Content Management",
      url: "/dashboard/content-management",
      icon: <ContentManagementIcon />,
    },
    // {
    //   title: "Murmuration",
    //   url: "/dashboard/murmuration",
    //   icon: <MurmurationIcon />,
    // },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: <PaymentsIcon />,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <SettingsIcon />,
    },
    {
      title: "Report",
      url: "/dashboard/report",
      icon: <UserReportIcon />,
    },
    {
      title: "Subscription",
      url: "/dashboard/subscription",
      icon: <UserSubscriptionIcon />,
    },
    {
      title: "Website Infos",
      url: "/dashboard/website-infos",
      icon: <WebsiteInfosIcon />,
    },
    {
      title: "Ads",
      url: "/dashboard/ads",
      icon: <AdsIcon />,
    },
    {
      title: "Ucodes",
      url: "/dashboard/ucodes",
      icon: <UcodesIcon />,
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
const route = useRouter()

  const handleLogout= async()=>{
   await removeToken()
   route.push("/login")
  }

  return (
    <Sidebar collapsible='icon' {...props} className='bg-white'>
      <SidebarHeader className='p-6'>
        <Link href='/dashboard' className=''>
          <Image alt='The dig log' width={200} height={44} src='/logo.svg' />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavMain currentPath={pathname} items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} className="text-destructive  pl-4! hover:bg-destructive duration-500 transition cursor-pointer">
            <LogOut />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Smartphone, BarChart3, Activity } from "lucide-react";

export default function ReportTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "user-report";

  return (
    <div className="p-6 space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          router.push(`?tab=${value}`);
        }}
        className="w-full space-y-6"
      >
        <TabsList className="grid grid-cols-2 gap-3 max-w-md p-1.5 bg-white shadow-xs border border-border rounded-xl h-[56px]">
          <TabsTrigger
            value="user-report"
            className="py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all cursor-pointer"
          >
            User Report
          </TabsTrigger>
          <TabsTrigger
            value="app-report"
            className="py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all cursor-pointer"
          >
            App Report
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: User Report */}
        <TabsContent value="user-report" className="space-y-4">
          <Card className="border-border bg-white shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#C6A664]/10 text-[#C6A664]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">User Report</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Analyze user behavior, engagement statistics, and demographic trends.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                <p className="font-medium text-foreground">User Report Analytics</p>
                <p className="text-sm mt-1">Metrics, user reports, and registered accounts growth charts.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: App Report */}
        <TabsContent value="app-report" className="space-y-4">
          <Card className="border-border bg-white shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#C6A664]/10 text-[#C6A664]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">App Report</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Monitor mobile app logs, crash reports, and system performance.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                <Activity className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                <p className="font-medium text-foreground">App Performance & Crash Logs</p>
                <p className="text-sm mt-1">Detailed mobile application health reports and performance analytics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


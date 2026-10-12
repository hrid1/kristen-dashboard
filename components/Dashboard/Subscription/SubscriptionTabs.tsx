"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, CreditCard, Key } from "lucide-react";

export default function SubscriptionTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "user-subscription";

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
            value="user-subscription"
            className="py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all cursor-pointer"
          >
            User Subscription
          </TabsTrigger>
          <TabsTrigger
            value="subscription-access"
            className="py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all cursor-pointer"
          >
            Subscription Access
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: User Subscription */}
        <TabsContent value="user-subscription" className="space-y-4">
          <Card className="border-border bg-white shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#C6A664]/10 text-[#C6A664]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">User Subscription</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Manage member subscriptions, renewal dates, and plan statuses.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                <p className="font-medium text-foreground">User Subscriptions Content</p>
                <p className="text-sm mt-1">Detailed list of subscribed users and their billing cycles.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Subscription Access */}
        <TabsContent value="subscription-access" className="space-y-4">
          <Card className="border-border bg-white shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#C6A664]/10 text-[#C6A664]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Subscription Access</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Control access tiers, gated features, and entitlement permissions.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                <p className="font-medium text-foreground">Subscription Access Control</p>
                <p className="text-sm mt-1">Permission rules and plan feature assignments.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


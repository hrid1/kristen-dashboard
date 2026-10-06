"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import QuoteData from "@/components/Dashboard/ContentManagement/QuotesTable/QuotesTable";
import MeditationsTable from "@/components/Dashboard/ContentManagement/Meditations/Meditations";
import ExercisesTable from "@/components/Dashboard/ContentManagement/ExersisesTable/ExersisesTable";
import AllJournalTable from "@/components/Dashboard/ContentManagement/AllJournalTable/AllJournalTable";
import { RenderPortal } from "@/components/Reusable/RenderPortal";

export default function ContentManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 Read tab from URL
  const activeTab = searchParams.get("tab") || "Quotes";

  return (
    <div className="px-5 mt-6">
       
      <Tabs
        value={activeTab}  
        onValueChange={(value) => {
          router.push(`?tab=${value}`);
        }}
        className="w-full"
      >
        
        <TabsList className="grid grid-cols-4 gap-4 w-full p-1.5 bg-white shadow-sm rounded-xl h-[56px]">

          <TabsTrigger value="Quotes" className="py-3 px-6 rounded-lg hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all">
            Quotes
          </TabsTrigger>

          <TabsTrigger value="Meditations" className="py-3 px-6 rounded-lg hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all">
            Meditations
          </TabsTrigger>

          <TabsTrigger value="Exercises" className="py-3 px-6 rounded-lg hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all">
            Exercises
          </TabsTrigger>

          <TabsTrigger value="Journal" className="py-3 px-6 rounded-lg hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white transition-all">
            Journal
          </TabsTrigger>

        </TabsList>

        <TabsContent value="Quotes">
          <QuoteData />
        </TabsContent>

        <TabsContent value="Meditations">
          <MeditationsTable />
        </TabsContent>

        <TabsContent value="Exercises">
          <ExercisesTable />
        </TabsContent>

        <TabsContent value="Journal">
          <AllJournalTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
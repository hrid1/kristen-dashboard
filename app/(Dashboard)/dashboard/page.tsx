"use client";

import DashboardBarChart from "@/components/Reusable/DashboardBarChart";
import DashboardChart from "@/components/Reusable/DashboardChart";
import KeyMetrics from "@/components/Reusable/KeyMetrics";
import { RenderPortal } from "@/components/Reusable/RenderPortal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


interface PaymentResponse {
  success: boolean;
  data: {
    // total: {
    //   text: string;
    //   value: string;
    // };
    // yearly: {
    //   text: string;
    //   value: string;
    // };
    // monthly: {
    //   text: string;
    //   value: string;
    // };
    topDigs: {
      text: string;
      digs: {
        id: string;
        title: string;
        type?:string;
      }[];
    };
  };
}



export default function DashboardPage() {
  const axiosPrivate = useAxiosPrivate();
  const [selectStatus, setSelectStatus] = useState("this_month");
  const formatType = (value: string) =>
    value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  
  const { data: status } = useQuery({
    queryKey: ["dashboard-stats", selectStatus],
    queryFn: async () => {
      const res = await axiosPrivate.get(
        `/dashboard/stats/${selectStatus}`
      );
      return res.data;
    },
  });

  const { data: paymentData } = useQuery<PaymentResponse>({
    queryKey: ["payment-status"],
    queryFn: async () => {
      const res = await axiosPrivate.get(
        `/dashboard/payment-stats`
      );
      
      return res.data;
    },
    
  });
console.log(paymentData,"paymenrtt")
  
  const digs = paymentData?.data?.topDigs?.digs || [];
  // console.log("digs", digs)

  const { data: adminData } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await axiosPrivate.get(
        "/dashboard/overview"
      );
      return res.data;
    },
  });


  const handleSelectData = (value: string) => {
    setSelectStatus(value);
  };

  return (
    <div className="space-y-6 p-6">
      <RenderPortal elementId='header-title' >Overview</RenderPortal>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Key Metrics
        </h1>

        <Select
          defaultValue={selectStatus}
          onValueChange={handleSelectData}
        >
          <SelectTrigger className="w-[140px] border border-[#C6A66480] bg-white p-2">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">
              This month
            </SelectItem>
            <SelectItem value="last_7_days">
              Last week
            </SelectItem>
            <SelectItem value="last_month">
              Last month
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <KeyMetrics data={status?.data} />

      {/* Charts + Payment Card */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-8">
          <DashboardChart chartData={adminData?.data} />
        </div>

        {/* Payment Status Card */}
        <div className="col-span-1 lg:col-span-4 rounded-2xl border border-[#C6A66480] bg-white p-4">
          <h2 className="text-base font-semibold text-gray-900">
           {paymentData?.data.topDigs.text}
          </h2>
          <hr className="my-4 border border-[#C6A66480]"/>

         <div>
          {
            digs.map((item)=>{
              return (
              <div key={item.id}>
                  <div className="font-medium text-base text-[#1D1F2C] leading-160%">
                    {
                      item.title
                    }
              </div>
                  <div className="text-xs mt-1 text-[#777980] font-normal">
                    {String(item?.type ?? "-").replace(/_/g, " ")}
                  </div>
                  <hr className="border my-3"/>
              </div>
            )})
          }
         </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-8">
        <DashboardBarChart
          chartData={adminData?.data?.currentYear}
        />
      </div>
    </div>
  );
}

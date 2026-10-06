"use client";

import { DashboardSidebar } from "@/components/Dashboard/Sidebar/DashboardSidebar";
import NotificationBell from "@/components/Notification/NotificationBell";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NotificationProvider } from "@/hooks/Contex";
import { RenderPortal } from "@/components/Reusable/RenderPortal";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";

/* ---------------- INNER DASHBOARD ---------------- */

function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const axiosPrivate = useAxiosPrivate(); 

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosPrivate.get("/auth/me");
      return res.data;
      
    },
    
  });

  // console.log(data,"dfdfdf")
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-[#FFFEFA]">
        <header className="bg-sidebar border-border sticky top-0 z-50 flex h-24 w-full shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <div className="flex justify-between items-center w-full">
              <div id="header-title" className="text-xl font-semibold">

              </div>

              <div className="flex items-center gap-3">
                <NotificationBell />

                {data?.data.avatar_url && (
                  <Link href="/login">
                    <Image
                      src={data?.data?.avatar_url}
                      alt="profile"
                      height={48}
                      width={48}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                  </Link>
                )}
                
              </div>
            </div>
          </div>
        </header>

        <div className="bg-[#FFFEFA]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>   <DashboardContent>{children}</DashboardContent></NotificationProvider>
   
    </QueryClientProvider>
  );
}




// "use client";

// import { DashboardSidebar } from "@/components/Dashboard/Sidebar/DashboardSidebar";
// import NotificationIcon from "@/components/icons/NotificationIcon";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import Image from "next/image";
// import {
//   QueryClient,
//   QueryClientProvider,
//   useQuery,
// } from "@tanstack/react-query";
// import Link from "next/link";
// import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
// import { useEffect, useRef, useState } from "react";


// interface NotificationEvent {
//   id: string;
//   text: string;
//   type: string;
// }
// interface Sender {
//   id: string;
//   name: string;
//   email: string;
//   image: string;
// }
// interface Notification {
//   id: string;
//   created_at: string;
//   receiver_id: string;
//   entity_id: string | null;
//   sender: Sender | null;  
//   notification_event: NotificationEvent;
// }

// interface NotificationResponse {
//   success: boolean;
//   data: Notification[];
// }


// const queryClient = new QueryClient();

// function DashboardContent({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const AxiosPrivate = useAxiosPrivate();
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);



//   const { data: paymentData } = useQuery<NotificationResponse>({
//     queryKey: ["notification"],
//     queryFn: async () => {
//       const res = await AxiosPrivate.get("/admin/notification");
//       console.log("data", paymentData);

//       return res.data;
      
//     },
    
//   });

//   console.log("data",paymentData);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);


//   return (
//     <SidebarProvider>
//       <DashboardSidebar />
//       <SidebarInset className="bg-[#FFFEFA]">
//         <header className="bg-sidebar border-border sticky top-0 z-50 flex h-24 w-full shrink-0 items-center gap-2 border-b">
//           <div className="flex flex-1 items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="mr-2 data-[orientation=vertical]:h-4"
//             />

//             <div className="flex justify-between items-center w-full">
//               <div className="text-[#1D1F2C] font-semibold text-[24px]" />

//               <div className="flex items-center gap-3">
//              <div ref={dropdownRef} className="relative">
//                   <div
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setOpen((prev) => !prev);
//                     }}
//                     className="cursor-pointer relative flex"
//                   >
//                     <div className="bg-[#F9F6F0] p-4 rounded-full">
//                       <NotificationIcon />
//                     </div>

//                     <span className="bg-red-600 flex justify-center items-center text-white absolute -right-1 size-5 rounded-full text-xs">
//                       {paymentData?.data?.length ?? 0}
//                     </span>
//                     <div className="mt-12 overflow-y-auto">
//                       {open && (
//                         <div
//                           onClick={(e) => e.stopPropagation()}
//                           className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-50"
//                         >
//                           <div className="p-4 border-b font-semibold">
//                             Notifications
//                           </div>

//                           <div className="max-h-80 overflow-y-auto">
//                             {paymentData?.data?.length ? (
//                               paymentData.data.map((item) => (
//                                 <div
//                                   key={item.id}
//                                   className="p-4 border-b hover:bg-gray-50 cursor-pointer"
//                                 >
//                                   <p className="text-sm font-medium">
//                                     {item.notification_event.text}
//                                   </p>
//                                   {/* <p className="text-sm font-medium">
//                                     {item.notification_event.type}
//                                   </p> */}

//                                   <p className="text-xs text-gray-500 mt-1">
//                                     {new Date(item.created_at).toLocaleString()}
//                                   </p>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="p-4 text-sm text-gray-500">
//                                 No notifications
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                   </div>
//              </div>

//                 <Link href="/login">
//                   <Image
//                     src="/setting/profile.jpg"
//                     alt="profile"
//                     height={48}
//                     width={48}
//                     className="rounded-full w-12 h-12 object-cover"
//                   />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="bg-[#FFFEFA]">{children}</div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }


// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <DashboardContent>{children}</DashboardContent>
//     </QueryClientProvider>
//   );
// }


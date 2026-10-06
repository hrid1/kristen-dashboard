"use client";

import NotificationIcon from "@/components/icons/NotificationIcon";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NotificationDropdown from "./NotificationDropdown";
import useOutsideClick from "@/hooks/UseOutsideClick";
import { useNotificationProvider } from "@/hooks/Contex";

/* ---------------- TYPES ---------------- */

export interface NotificationEvent {
    id: string;
    text: string;
    type: string;
}

export interface Sender {
    id: string;
    name: string;
    email: string;
    image?: string;
}

export interface Notification {
    id: string;
    sender_id?: string | null;
    receiver_id: string;
    entity_id: string | null;
    created_at: string;
    sender: Sender | null;
    notification_event: NotificationEvent;
}

export interface NotificationResponse {
    success: boolean;
    data: Notification[];
}

/* ---------------- COMPONENT ---------------- */

export default function NotificationBell() {
    const AxiosPrivate = useAxiosPrivate();
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    useOutsideClick(wrapRef, () => setOpen(false));

    const { data } = useQuery<NotificationResponse>({
        queryKey: ["notification"],
        queryFn: async () => {
            const res = await AxiosPrivate.get("/notification");
            return res.data;
        },
        staleTime: 10000,
    });

    const notifications = data?.data ?? [];

    const { notificationCounter } = useNotificationProvider()

    return (
        <div ref={wrapRef} className="relative">
            {/* Bell */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                className="cursor-pointer"
            >
                <div className="bg-[#F9F6F0] p-4 rounded-full relative">
                    <NotificationIcon />
                    <span className="bg-red-600 text-white text-xs absolute top-0 -right-1 w-5 h-5 flex items-center justify-center rounded-full">
                        {/* notifications.length +  */}
                        {notifications.length + notificationCounter}

                    </span>
                </div>
            </div>

            {/* Dropdown */}
            {open && (
                <NotificationDropdown notifications={notifications} />
            )}
        </div>
    );
}




// "use client";

// import NotificationIcon from "@/components/icons/NotificationIcon";
// import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
// // import { socket } from "@/lib/socket";
// import { useEffect, useRef, useState } from "react";
// import {

//     useQuery,
//     useQueryClient,
// } from "@tanstack/react-query";
// import NotificationDropdown from "./NotificationDropdown";
// import useOutsideClick from "@/hooks/UseOutsideClick";
// import { io } from "socket.io-client";
// import { useNotification } from "@/hooks/Contex";

// export interface NotificationEvent {
//     id: string;
//     text: string;
//     type: string;
// }

// export interface Sender {
//     id: string;
//     name: string;
//     email: string;
//     image?: string;
// }

// export interface Notification {
//     id: string;
//     sender_id?: string | null;
//     receiver_id: string;
//     entity_id: string | null;
//     created_at: string;
//     sender: Sender | null;
//     notification_event: NotificationEvent;
// }

// export interface NotificationResponse {
//     success: boolean;
//     data: Notification[];
// }

// const socket = io("https://delayed-packing-operation-tanks.trycloudflare.com");
// export default function NotificationBell() {
//     const AxiosPrivate = useAxiosPrivate();
//     const queryClient = useQueryClient();

//     const [open, setOpen] = useState(false);
//     const wrapRef = useRef<HTMLDivElement>(null);
//     const { count } = useNotification();



//     useOutsideClick(wrapRef, () => setOpen(false));

//     const { data: resData } = useQuery<NotificationResponse>({
//         queryKey: ["notification"],
//         queryFn: async () => {
//             const res = await AxiosPrivate.get("/admin/notification");
//             return res.data;
//         },
//         staleTime: 10_000,
//     });


//     const notifications = resData?.data ?? [];



//     // useEffect(() => {
//     //     socket.on("connect", () => console.log("socket connect"))

//     //     socket.on("notification", (data) => onNewNotification)

//     //     console.log("check=============");
//     // }, [])

//     useEffect(() => {
//         socket.on("connect", () => console.log("socket connect"))

//         function onNewNotification(newOne: Notification) {
//             console.log("onNewNotification")

//             queryClient.setQueryData<NotificationResponse>(["notification"], (old) => {
//                 if (!old) return { success: true, data: [newOne] };

//                 const exists = old.data.some((n) => n.id === newOne.id);
//                 if (exists) return old;

//                 return { ...old, data: [newOne, ...old.data] };
//             });



//         }
//         // const newOne = {
//         //     id: "000",
//         //     sender_id: "2222",
//         //     receiver_id: "8888",
//         //     entity_id: "8888",
//         //     created_at: "8888",
//         //     sender: "8888",
//         //     notification_event: "8888"
//         // }

//         // setTimeout(() => {
//         //     console.log("duummy notificatin")
//         //     queryClient.setQueryData<NotificationResponse>(["notification"], (old) => {
//         //         if (!old) return { success: true, data: [newOne] };

//         //         const exists = old.data.some((n) => n.id === newOne.id);
//         //         if (exists) return old;

//         //         return { ...old, data: [newOne, ...old.data] };
//         //     });
//         // }, 3000);


//         socket.on("notification", onNewNotification);

//         return () => {
//             socket.off("notification", onNewNotification);
//         };
//     }, [queryClient]);


//     // useEffect(() => {
//     //     socket.on("connect", () => {
//     //         console.log("Socket connected:", socket.id);
//     //     });

//     //     socket.on("connect_error", (err) => {
//     //         console.log("Socket error:", err.message);
//     //     });
//     // }, []);


//     return (
//         <div ref={wrapRef} className="relative">

//             <div
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     setOpen((p) => !p);
//                 }}
//                 className="cursor-pointer"
//             >
//                 <div className="bg-[#F9F6F0] p-4 rounded-full relative">
//                     <NotificationIcon />
//                     <span className="bg-red-600 text-white text-xs absolute top-0 -right-1 w-5 h-5 flex items-center justify-center rounded-full">
//                         {notifications.length + count}
//                     </span>

//                 </div>
//             </div>


//             {open && (
//                 <NotificationDropdown
//                     notifications={notifications}
//                 />
//             )}

//         </div>
//     );
// }

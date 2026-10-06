"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { NotificationResponse } from "@/components/Notification/NotificationBell";
import { getToken } from "./token";

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

const NotificationContext = createContext<{ notificationCounter: number }>({
    notificationCounter: 0,
});

export function NotificationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = useQueryClient();

    const [token, setToken] = useState<string | null | undefined>(null);
    const [notificationCounter, setNotificationCounter] = useState(0);

 
    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await getToken();
            setToken(storedToken);
        };

        loadToken();
    }, []);

    useEffect(() => {
       
        if (!token) return;
  

        const socket: Socket = io(
            process.env.NEXT_PUBLIC_SOCKET_URL!,
            {
                transports: ["websocket"],
                auth: {
                    token: token,
                },
            }
        );

        socket.on("connect", () => {
            console.log(" Socket connected:", socket.id);
        });

        socket.on("notification", (newOne: Notification) => {
            setNotificationCounter((v) => v + 1);

            queryClient.setQueryData<NotificationResponse>(
                ["notification"],
                (old) => {
                    if (!old) {
                        return {
                            success: true,
                            data: [newOne],
                        };
                    }

                    const exists = old.data.some(
                        (n) => n.id === newOne.id
                    );

                    if (exists) return old;

                    return {
                        ...old,
                        data: [newOne, ...old.data],
                    };
                }
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [token, queryClient]); 

    return (
        <NotificationContext.Provider value={{ notificationCounter }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotificationProvider = () =>
    useContext(NotificationContext);

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { toast } from "sonner";

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

interface NotificationDropdownProps {
    notifications: Notification[];
}

export default function NotificationDropdown({
    notifications,
}: NotificationDropdownProps) {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const { mutate: deleteNotification, isPending } = useMutation<
        void,
        Error,
        string
    >({
        mutationFn: async (id: string) => {
            await axiosPrivate.delete(`/admin/notification/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
            toast.success("Notification deleted");
        },
        onError: () => {
            toast.error("Failed to delete notification");
        },
    });

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-50"
        >
            <div className="p-4 border-b font-semibold">
                Notifications
            </div>

            <div className="max-h-80 overflow-y-auto">
                {notifications.length ? (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 border-b hover:bg-gray-50 flex justify-between items-start"
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    {item.notification_event.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(item.created_at).toLocaleString()}
                                </p>
                            </div>

                            <button
                                disabled={isPending}
                                onClick={() => deleteNotification(item.id)}
                                className="text-red-500 text-xs hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-sm text-gray-500">
                        No notifications
                    </div>
                )}
            </div>
        </div>
    );
}

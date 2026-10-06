import React from "react";

type Toast = {
    id: number;
    title: string;
    description?: string;
    variant?: "default" | "destructive";
};

export function Toaster({ toasts }: { toasts: Toast[] }) {
    return (
        <div className="fixed top-5 right-5 space-y-2 z-50">
            {toasts.map(({ id, title, description, variant }) => (
                <div
                    key={id}
                    className={`p-4 rounded shadow-md max-w-xs ${variant === "destructive" ? "bg-red-500 text-white" : "bg-gray-800 text-white"
                        }`}
                >
                    <strong>{title}</strong>
                    {description && <p>{description}</p>}
                </div>
            ))}
        </div>
    );
}

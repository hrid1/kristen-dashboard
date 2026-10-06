import { useState, useCallback } from "react";

type Toast = {
    id: number;
    title: string;
    description?: string;
    variant?: "default" | "destructive";
};

let idCounter = 0;

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((toast: Omit<Toast, "id">) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return { toast, toasts };
}

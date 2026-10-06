"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface RenderPortalProps extends PropsWithChildren {
    elementId: string;
}

export const RenderPortal = ({ children, elementId }: RenderPortalProps) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const el = document.getElementById(elementId);
        if (!el) {
            console.warn(`RenderPortal: Element with id "${elementId}" not found`);
        }

        const id = window.requestAnimationFrame(() => {
            setContainer(el);
        });

        return () => window.cancelAnimationFrame(id);
    }, [elementId]);

    if (!container) return null;

    return createPortal(children, container);
};

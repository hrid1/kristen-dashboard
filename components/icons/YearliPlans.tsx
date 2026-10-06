import React from "react";

interface YearliPlansProps {
    className?: string;
}

export default function YearliPlans({ className }: YearliPlansProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            className={className}
        >
            <path
                d="M1.92467 14.8911C0.358443 13.3249 0.358443 10.7855 1.92467 9.2193L9.2193 1.92467C10.7855 0.358443 13.3249 0.358443 14.8911 1.92467L19.5753 6.60891C21.1416 8.17514 21.1416 10.7145 19.5753 12.2807L12.2807 19.5753C10.7145 21.1416 8.17514 21.1416 6.60891 19.5753L1.92467 14.8911Z"
                stroke="#C6A664"
                strokeWidth="1.5"
            />
        </svg>
    );
}

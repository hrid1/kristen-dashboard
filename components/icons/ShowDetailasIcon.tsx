import React from "react";

interface YearliPlansProps {
    className?: string;
}

export default function ShowDetailsIcon({ className }: YearliPlansProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M21.5479 11.046C21.8519 11.4723 22.0039 11.6855 22.0039 12.001C22.0039 12.3165 21.8519 12.5297 21.5479 12.956C20.1818 14.8716 16.6931 19.001 12.0039 19.001C7.31469 19.001 3.82601 14.8716 2.45995 12.956C2.15592 12.5297 2.00391 12.3165 2.00391 12.001C2.00391 11.6855 2.15592 11.4723 2.45995 11.046C3.82601 9.13042 7.31469 5.00098 12.0039 5.00098C16.6931 5.00098 20.1818 9.13042 21.5479 11.046Z" stroke="#777980" strokeWidth="1.54" />
            <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="#777980" strokeWidth="1.54" />
        </svg>
    );
}

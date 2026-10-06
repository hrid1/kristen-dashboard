import { Badge } from "../ui/badge";

interface StatusBadgeProps {
    status: string;
}

export function Badges({ status }: StatusBadgeProps) {
    // Automatically pick color based on status
    const colorMap: Record<string, string> = {
        Active: "bg-[#E9FAEE] text-[#219143] font-sf-pro-display text-[14px] font-medium leading-[1.4] tracking-[0.07px] py-1 px-3",
        Pending: "bg-[#FFF4E5] text-[#C6A664] py-1 px-3",
        Ended: " bg-[#F6F8FA] py-1 px-3 text-[#4A4C56] font-sf-pro-display text-[14px] font-medium leading-[1.4] tracking-[0.07px]",
        inactive: "bg-[#F6F8FA] text-[#1F2937]"
    };

    const colorClass =
        colorMap[status as keyof typeof colorMap] ||
        "bg-[#F6F8FA] text-[#4A4C56]";

    return (
        <Badge className={`border-transparent px-3 py-1 ${colorClass}`}>
            <span className="text-xs capitalize">{status}</span>
        </Badge>
    );
}

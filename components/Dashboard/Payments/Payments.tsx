"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import TotalReveniew from "@/components/icons/TotlaReveinew";
import YearliIcon from "@/components/icons/YearliPlans";
import MonthllyIcon from "@/components/icons/MonthlyPlans";
import PaymentsTable from "./PaymentsTable";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import DownloadIcon from "@/components/icons/Download";
import { PaymentTableDownload } from "./PaymentTableDownload";
import { pdf } from "@react-pdf/renderer";

export interface Payments {
    user: string;
    email: string;
    plan: string;
    paymentpage: string;
    card: string;
    lastpayment: string;
    status: string;
}

type CardItem = {
    id: number;
    icon: React.ReactNode;
    title: string;
    desc: string | number;
    btn: string;
};

interface CardDataProps {
    item: CardItem[];
}

interface User {
    name: string;
    email: string;
    status: "Active" | "Ended" | "Pending";
    plan: "Monthly" | "Yearly" | "Free";
}

export interface Subscription {
    id: string;
    planName: string;
    status: "active" | "inactive" | "cancelled";
    updated_at: string;
    cardLast4: string;
    user: {
        email: string;
        name: string;
    };
}

interface Pagination {
    total: number;
    totalPages: number;
    currentPage: number;
}

interface PaymentsResponse {
    data: Subscription[];
    pagination: Pagination;
}

export default function PaymentPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User>({
        name: "Alice Johnson",
        email: "alice@example.com",
        status: "Active",
        plan: "Monthly",
    });
    const [period, setPeriod] = useState("Yearly");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const axiosPrivate = useAxiosPrivate();

    // Fetch payment stats
    const { data: paymentStats = {} } = useQuery({
        queryKey: ["dashboard-payment-stats"],
        queryFn: async () => {
            const res = await axiosPrivate.get("/dashboard/payment-stats");
            return res.data;
        },
    });


    const [page, setPage] = useState(1);
    const limit = 8;

    const { data: tableData, isLoading } = useQuery({
        queryKey: ["all-Payments", status ?? "", page, period],
        queryFn: async (): Promise<PaymentsResponse> => {
            const params = new URLSearchParams();

            if (status) params.append("status", status);
            if (period) params.append("planName", period);
            params.append("page", String(page));
            params.append("limit", String(limit));

            const res = await axiosPrivate.get(
                `/dashboard/payment-overview?${params.toString()}`
            );

            return res.data;
        },
        placeholderData: (prev) => prev,
    });


    const downloadAsPdf3 = async () => {
        const blob = await pdf(<PaymentTableDownload apiItem={tableData?.data} />).toBlob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${"download"}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        // toast.success("Download resume");
    };


    // Prepare card data
    const data: CardItem[] = [
        {
            id: 1,
            icon: <TotalReveniew />,
            title: "Total Revenue",
            desc: paymentStats?.data?.total?.value ?? 0,
            btn: "Last Year",
        },
        {
            id: 2,
            icon: <YearliIcon />,
            title: "Yearly Plans",
            desc: paymentStats?.data?.yearly?.value ?? 0,
            btn: "+5 Week",
        },
        {
            id: 3,
            icon: <MonthllyIcon />,
            title: "Monthly Plans",
            desc: paymentStats?.data?.monthly?.value ?? 0,
            btn: "-1.2%",
        },
    ];

    return (
        <div className="p-5 relative bg-[#FFFEFA]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                <CardData item={data} />
            </div>

            <div className="rounded-[16px] mt-6">
                <div className="flex items-end justify-end pt-6 px-6 space-x-2">
                    {/* Status Filter */}
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Period Filter */}
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent className="text-[#4A4C56] font-manrope text-[14px] font-medium leading-[140%] tracking-[0.07px]">
                            <SelectItem value="Yearly">Yearly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="LifeTime">Life Time</SelectItem>
                            <SelectItem value="Free">Free</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Export Button */}
                    <Button onClick={downloadAsPdf3} className="bg-[#C6A664] text-white cursor-pointer">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export List
                    </Button>
                </div>

                {/* Data Table */}
                <PaymentsTable data={tableData} isLoading={isLoading} page={page} setPage={setPage} limit={limit} />
            </div>

            {/* Modal Example */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg">
                        <h2 className="text-[18px] font-manrope font-semibold text-[#4A4C56] mb-3">
                            Edit User Status
                        </h2>
                        <p className="text-[14px] text-[#777980] mb-4">
                            {user.name} ({user.email})
                        </p>

                        <Select
                            value={user.status}
                            onValueChange={(val) =>
                                setUser({ ...user, status: val as User["status"] })
                            }
                        >
                            <SelectTrigger className="w-full mb-4">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Ended">Ended</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex justify-end space-x-2">
                            <Button variant="ghost" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#C6A664] text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// CardData Component
const CardData: React.FC<CardDataProps> = ({ item }) => {
    return (
        <>
            {item?.map((data, index) => (
                <div
                    key={index}
                    className="bg-white border border-[rgba(198,166,100,0.5)] rounded-[16px] py-5 px-4 flex items-center gap-5"
                >
                    {/* Icon */}
                    <div className="rounded-full bg-[#F9F6F0] flex justify-center items-center p-4">
                        {data.icon}
                    </div>

                    {/* Content */}
                    <div className="flex justify-between flex-1 items-end">
                        <div>
                            <p className="text-[#777980] text-[14px] font-medium">
                                {data.title}
                            </p>
                            <p className="text-[#1F2937] text-[32px] font-semibold">
                                {data.desc}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

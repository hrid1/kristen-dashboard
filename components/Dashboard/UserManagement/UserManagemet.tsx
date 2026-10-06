"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import DownloadIcon from "@/components/icons/Download";
import UserTable from "./UserTable";
import { UserTableDownload } from "./UserTableDownload";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQuery } from "@tanstack/react-query";


type TUser = {
    id: string;
    name: string;
    email: string;
    phone_number: string | null;
    address: string | null;
    type: string;
    status: 0 | 1;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
};

type Pagination = {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
};

type UsersResponse = {
    success: boolean;
    message: string;
    data: TUser[];
    pagination: Pagination;
};

export default function UserManagementTable() {


    const [date, setDate] = useState<Date | undefined>();
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [yearly, setYearly] = useState<string | undefined>(undefined);

    // const [period, setPeriod] = useState("Yearly");

    const axiosPrivate = useAxiosPrivate();

    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, refetch, isLoading, isError, error, isFetching } =
        useQuery<UsersResponse>({
            queryKey: ["all-user", date, status, page, yearly],
            queryFn: async () => {
                const params = new URLSearchParams();

                if (status) {
                    params.append("status", status);
                }
                console.log(yearly)

                if (yearly && yearly !== "all") {
                    params.append("plan", yearly);
                }


                if (date) {
                    params.append("joined", format(date, "yyyy-MM-dd"));
                }

                params.append("page", String(page));
                params.append("limit", String(limit));

                console.log("QUERY:", params.toString());

                const res = await axiosPrivate.get(
                    `/admin/user?${params.toString()}`
                );

                return res.data;
            },
            placeholderData: (prev) => prev,
        });


    const downloadAsPdf3 = async () => {
        const blob = await pdf(<UserTableDownload apiItem={data?.data} />).toBlob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${"download"}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        // toast.success("Download resume");
    };

    return (
        <div className="p-5 relative">
            <div className="border border-[#F9F6F0] bg-white rounded-[16px] p-6">
                <div className="flex flex-wrap md:items-end md:justify-end gap-2">
                    {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-[160px] justify-start text-left font-normal flex gap-3"
                            >
                                {date ? format(date, "yyyy-MM-dd") : "yyyy-mm-dd"}
                                <CalendarIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Status */}
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Period */}
                    <Select value={yearly} onValueChange={setYearly}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Subscription" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Export */}
                    <Button onClick={downloadAsPdf3} className="bg-[#C6A664] text-white cursor-pointer">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export List
                    </Button>
                </div>

                {/* Table */}
                <UserTable data={data} refetch={refetch} isLoading={isLoading} isError={isError} error={error} isFetching={isFetching} page={page} setPage={setPage} />

            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import EditIcon from "@/components/icons/EditIcon";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { Spinner } from "@/components/Reusable/Loading";

type EditUserModalProps = {
    id: string;
    name:string;
    refetch: () => void;
};

export default function EditUserModal({ id, refetch}: EditUserModalProps) {
    const axiosPrivate = useAxiosPrivate();

    const [status, setStatus] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async () => {
        try {
            setLoading(true);

            const result = await axiosPrivate.patch(`/admin/user/action/${id}`, {
                status,
            });
            if (result?.data?.success) {
                toast.success(result?.data?.message)
                refetch();
            }
        } catch (error) {
            console.error("Failed to update status", error);
            toast.success("Meditation created successfully");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button>
                    <EditIcon />
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User status</DialogTitle>
                </DialogHeader>

                <DialogDescription asChild>
                    <div className="bg-white rounded-lg">
                        

                        {/* Status Select */}
                        <div className="mb-6">
                            <label className="block mb-1 font-semibold text-gray-700">
                                Status
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={status}
                                onChange={(e) => setStatus(Number(e.target.value))}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </div>
                        {/* <div className="mb-6">
                            <label className="block mb-1 font-semibold text-gray-700">
                                Status
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={status}
                                onChange={(e) => setStatus(Number(e.target.value))}
                            >
                                <option value={1}>Monthly</option>
                                <option value={0}>Yearly</option>
                            </select>
                        </div> */}
                     
                       

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end">
                            <DialogClose asChild>
                                <button
                                    className="px-8 py-4 rounded-[12px] bg-gray-100 text-gray-700 hover:bg-gray-200 w-[232px]"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </DialogClose>

                            <DialogClose asChild>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={loading}
                                    className="px-8 py-4 rounded-[12px] bg-[#C6A664] text-white hover:bg-[#a28e51] w-[232px] disabled:opacity-50 flex items-center justify-center cursor-pointer"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Spinner size="sm" color="#ffffff" />
                                            <span>Saving...</span>
                                        </span>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

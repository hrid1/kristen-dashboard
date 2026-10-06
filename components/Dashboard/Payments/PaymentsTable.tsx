"use client";

import ArrowLeftIcon from "@/public/icon/ArrowLeftIcon";
import ArrowRightIcon from "@/public/icon/ArrowRightIcon";

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

type PaymentsTableProps = {
    date?: string;
    status?: "active" | "inactive";
    period?: string
};

interface PaymentTableProps {
    data: PaymentsResponse | undefined;
    isLoading: boolean;
    page: number;
    setPage: (page: number | ((prev: number) => number)) => void;
    limit: number
}

export default function PaymentsTable({
    data,
    isLoading,
    page,
    setPage,
    limit
}: PaymentTableProps) {


    const payments = data?.data ?? [];
    const pagination = data?.pagination;

    return (
        <div className="w-full overflow-x-auto rounded-xl bg-white mt-5">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4 text-left">User</th>
                        <th className="px-6 py-4 text-left">Plan</th>
                        <th className="px-6 py-4 text-left">Payment Method</th>
                        <th className="px-6 py-4 text-left">Card</th>
                        <th className="px-6 py-4 text-left">Last Payment</th>
                        <th className="px-6 py-4 text-left">Status</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-gray-400">
                                Loading...
                            </td>
                        </tr>
                    ) : payments.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-gray-400">
                                No Payments found
                            </td>
                        </tr>
                    ) : (
                        payments.map((payment) => {
                            return (
                              <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="font-medium text-gray-900">
                                    {payment.user?.name}
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {payment.user?.email}
                                  </div>
                                </td>

                                <td className="px-6 py-4 ">
                                  {payment.planName}
                                </td>

                                <td className="px-6 py-4 ">Stripe</td>

                                <td className="px-6 py-4 ">
                                  **** {payment.cardLast4}
                                </td>

                                <td className="px-6 py-4 ">
                                  {
                                    new Date(payment.updated_at)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </td>

                                <td className="px-6 py-4">
                                  {payment.status === "active" ? (
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                                      Inactive
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">

                    {/* Buttons */}
                    <div className="flex items-center gap-2">

                        {/* Prev */}
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="px-3 py-2 border border-[#F1F2F4] rounded-[8px] disabled:opacity-40"
                        >
                            <ArrowLeftIcon />
                        </button>

                        {/* Page Numbers */}
                        {[...Array(pagination.totalPages || 1)].map((_, index) => {
                            const pageNumber = index + 1;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                    className={`px-3 py-1 border ${page === pageNumber
                                        ? "bg-[#C6A664] text-white rounded-[12px]"
                                        : "bg-white rounded-[8px]"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            disabled={page === (pagination.totalPages || 1)}
                            onClick={() =>
                                setPage((prev) =>
                                    Math.min(prev + 1, pagination.totalPages || 1)
                                )
                            }
                            className="px-3 py-2 border border-[#F1F2F4] rounded-[8px] disabled:opacity-40"
                        >
                            <ArrowRightIcon />
                        </button>
                    </div>

                    {/* Showing Text */}
                    <div className="text-gray-500 text-sm">
                        Showing{" "}
                        {(pagination.currentPage - 1) * limit + 1}
                        {" - "}
                        {Math.min(
                            pagination.currentPage * limit,
                            pagination.total
                        )}{" "}
                        of {pagination.total} entries
                    </div>
                </div>
            )}

        </div>
    );
}

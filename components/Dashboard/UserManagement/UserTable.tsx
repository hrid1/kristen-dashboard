"use client";

import EditUserModal from "../EditUSerModal/UserModal";
import ArrowLeftIcon from "@/public/icon/ArrowLeftIcon";
import ArrowRightIcon from "@/public/icon/ArrowRightIcon";
import { ReactNode } from "react";

// Define types
type TUser = {
  subscriptionPlan: ReactNode;
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

interface UserTableProps {
  data: UsersResponse | undefined;
  refetch: () => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
}

export default function UserTable({
  data,
  refetch,
  isLoading,
  isError,
  error,
  isFetching,
  page,
  setPage,
}: UserTableProps) {
  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error?.message}
      </div>
    );

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  console.log(users);

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white mt-5">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Subscription</th>
            <th className="px-6 py-4 text-left">Joined Date</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {users.length > 0 ? (
            users.map((user: TUser) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-400 text-xs">{user.email}</div>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.subscriptionPlan}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(user.created_at).toISOString().split("T")[0]}
                </td>

                <td className="px-6 py-4">
                  {user.status === 1 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <EditUserModal
                    id={user.id}
                    refetch={refetch}
                    name={user.name}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-400">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage((prev: number) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeftIcon />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 transition-colors ${
                    page === num
                      ? "bg-[#C6A664] text-white rounded"
                      : "hover:bg-gray-100 rounded"
                  }`}
                  aria-label={`Go to page ${num}`}
                  aria-current={page === num ? "page" : undefined}
                >
                  {num}
                </button>
              ),
            )}

            <button
              disabled={page === pagination.totalPages || isFetching}
              onClick={() => setPage((prev: number) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <ArrowRightIcon />
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.perPage + 1} to{" "}
            {Math.min(pagination.page * pagination.perPage, pagination.total)}{" "}
            of {pagination.total} entries
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "@/components/Reusable/DeletDialouge";
import AddQuoteModal from "./AddQuotesModal";
import ViewQuoteModal from "./ViewQuotesModal";
import EditQuoteDialog from "./EditQuoteModal";
import ArrowRightIcon from "@/public/icon/ArrowRightIcon";
import ArrowLeftIcon from "@/public/icon/ArrowLeftIcon";
import { toast } from "sonner";
import EditIcon from "@/components/icons/EditIcon";

interface Quote {
  id: string;
  quote_text: string;
  quote_author: string;
  reason?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  _count: {
    quoteReactions: number;
  };
}

interface Pagination {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface QuotesResponse {
  success: boolean;
  message: string;
  data: Quote[];
  pagination: Pagination;
}

export default function QuotesTable() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // ✅ Backend Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // ---------------- FETCH ----------------
  const { data, isLoading, isError, error, isFetching } =
    useQuery<QuotesResponse, Error>({
      queryKey: ["quotes", page],
      queryFn: async () => {
        const res = await axiosPrivate.get(
          `/admin/content-management/allqoutes?page=${page}&limit=${limit}`
        );
        return res.data;
      },
      placeholderData: (prev) => prev,
      staleTime: 0,
    });

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    await axiosPrivate.delete(`/quotes/${selectedDeleteId}`);

    queryClient.invalidateQueries({
      queryKey: ["quotes"],
      exact: false,
    });

    setDeleteModalOpen(false);
    toast.success("Quotes Delete successfully");
    setSelectedDeleteId(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">{error.message}</div>;

  const quotes = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="bg-white rounded-xl mt-5 overflow-x-auto shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Quotes</h2>
        <Button onClick={() => setAddModalOpen(true)} className="cursor-pointer">
          Add New Quote
        </Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            <th className="px-6 py-4 text-left">Quote</th>
            <th className="px-6 py-4 text-left">Author</th>
            <th className="px-6 py-4 text-left">Focus Areas</th>
            <th className="px-6 py-4 text-right">Status</th>
            <th className="px-6 py-4 text-right">Reaction Count</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {quotes.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">
                {quote.quote_text}
              </td>
              <td className="px-6 py-4">
                {quote.quote_author}
              </td>
              <td className="px-6 py-4">
                {quote.reason || "-"}
              </td>
              <td className="px-6 py-4 text-right">
                <span
                  className={`px-3 py-1 rounded-full ${quote.status ? "bg-[#E9FAEE] text-[#219143]" :"bg-[#F6F8FA] text-"}`}>
                  {quote.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {quote._count?.quoteReactions ?? 0}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <button
                 
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedQuote(quote);
                      setViewModalOpen(true);
                    }}
                  >
                    <Eye className="h-5 w-6 text-[#777980]" />
                  </button>

                  <button
                   
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedQuote(quote);
                      setEditModalOpen(true);
                    }}
                  >
                    <EditIcon className=""/>
                  </button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      setSelectedDeleteId(quote.id);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {quotes.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                No quotes found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              <ArrowLeftIcon />
            
            </button>

            {Array.from(
              { length: pagination.totalPages },
              (_, i) => i + 1
            ).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 ${page === num
                    ? "bg-[#C6A664] text-white rounded"
                    : ""
                  }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={
                page === pagination.totalPages || isFetching
              }
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              <ArrowRightIcon />
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Showing{" "}
            {(pagination.page - 1) * pagination.perPage + 1} to{" "}
            {Math.min(
              pagination.page * pagination.perPage,
              pagination.total
            )}{" "}
            of {pagination.total} entries
          </div>
        </div>
      )}

      {/* MODALS */}
      <ViewQuoteModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        quote={selectedQuote}
      />

      <EditQuoteDialog
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedQuote(null);
        }}
        quoteToEdit={selectedQuote}
      />

      <AddQuoteModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete this quote?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import CreateNewJournalText from "./CreateNewJournalText";
import ViewJournalModal from "./ViewJornalModal";
import { ConfirmModal } from "@/components/Reusable/DeletDialouge";
import EditJournalModal from "./EditAllJournalModal";
import ArrowRightIcon from "@/public/icon/ArrowRightIcon";
import ArrowLeftIcon from "@/public/icon/ArrowLeftIcon";
import EditIcon from "@/components/icons/EditIcon";

export type JournalEntry = {
  id: string;
  title: string;
  journalType: "Text" | "Audio";
  author: string;
  tags: string[];
  publishDate: string;
  body?: string;
  audio?: string;
};





type JournalFromApi = {
  id: string;
  created_at: string;
  type: string;
  title: string;
  tags: string[];
  user: { name: string | null };
};

type JournalResponse = {
  success: boolean;
  message: string;
  data: JournalFromApi[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }
};

export default function AllJournalTable() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedid, setSelectedid] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;


  // For Confirm Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);

  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  
  const { data, isLoading, isError, error ,refetch} =
    useQuery<JournalResponse, Error>({
      queryKey: ["journals", page],
      queryFn: async () => {
        const res = await axiosPrivate.get(
          `/journels/all?page=${page}&limit=${perPage}`
        );
        return res.data;
      },
      // keepPreviousData: true,
    });
  console.log(data,"dbbbbbbb")

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/journels/${id}`);
 refetch()
    } catch (err) {
      console.error("Failed to delete journal", err);
    }
  };

  const journals: JournalEntry[] =
    data?.data.map((item) => {
      let parsedTags: string[] = [];

      if (item.tags?.length) {
        try {
          parsedTags = JSON.parse(item.tags[0]);
        } catch {
          parsedTags = [];
        }
      }


      const journalType: "Text" | "Audio" = item.type === "Audio" ? "Audio" : "Text";

      return {
        id: item.id,
        title: item.title || "-No Title-",
        journalType,
        author: item.user?.name ?? "-Unknown-",
        tags: parsedTags,
        publishDate: new Date(item.created_at).toISOString().split("T")[0],
        body: "",
        audio: "",
      };
    
    }) ?? [];


  if (isLoading) return <p>Loading journals...</p>;
  if (isError)
    return <p className="text-red-600">Failed to load journals: {error.message}</p>;
  
  if (showCreate) {
    return (
      <CreateNewJournalText
        onBack={() => setShowCreate(false)}
        breadLink={[
          { label: "List of All Journal", onClick: () => setShowCreate(false) },
          { label: "Create New Journal" },
        ]}
      />
    );
  }
  
  return (
    <>
      <div className="bg-white rounded-xl mt-5 overflow-x-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">List of All Journal</h2>

          <Button onClick={() => setShowCreate(true)} className="cursor-pointer" >
            <Plus className="mr-2 h-4 w-4" />
            Add Journal
          </Button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-[#1D1F2C] text-sm font-medium uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Journal</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Author</th>
              <th className="px-6 py-4 text-left">Tags</th>
              <th className="px-6 py-4 text-left">Publish Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {journals.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text">{item?.title}</td>
                <td className="px-6 py-4 text">{item.journalType}</td>
                <td className="px-6 py-4 text">{item.author}</td>
                <td className="px-6 py-4">
                  {item.tags.length ? (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-[#E9FAEE]  rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">-No Tags-</span>
                  )}
                </td>

                <td className="px-6 py-4 text-[#1F2937]">{item.publishDate}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="cursor-pointer"
                     
                      onClick={() => {
                        setSelectedJournal(item);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="h-5 w-6 text-[#777980]" />
                    </button>


                    <button
                      className="cursor-pointer"
                      // size="icon"
                      // variant="ghost"
                      onClick={() => {
                        setSelectedEditId(item.id);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <EditIcon className="h-9 " />
                    </button>


                    <Button

                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 cursor-pointer"
                      onClick={() => {
                        setSelectedDeleteId(item.id);
                        setConfirmModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      <ViewJournalModal
        open={isViewModalOpen}
        journal={selectedJournal}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedJournal(null);
        }}
      />


      <EditJournalModal
        open={isEditModalOpen}
        journal={journals.find(j => j.id === selectedEditId) || null}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmModalOpen}
        title="Are you sure you want to delete this journal?"
        description="This action cannot be undone."
        onConfirm={async () => {
          if (selectedDeleteId) {
            await handleDelete(selectedDeleteId);
            setConfirmModalOpen(false);
            setSelectedDeleteId(null);
          }
        }}
        onCancel={() => {
          setConfirmModalOpen(false);
          setSelectedDeleteId(null);
        }}
      />
      <div>
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">

            <div className="flex items-center gap-2">

              {/* Prev */}
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <ArrowLeftIcon />

              </Button>

              {/* Page Numbers */}
              {Array.from(
                { length: data.pagination.totalPages },
                (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Button
                      key={pageNumber}
                      size="sm"
                      variant={page === pageNumber ? "default" : "outline"}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                }
              )}

              {/* Next */}
              <Button
                variant="outline"
                size="sm"
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <ArrowRightIcon />
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              Showing{" "}
              {(data.pagination.page - 1) * data.pagination.perPage + 1}
              {" - "}
              {Math.min(
                data.pagination.page * data.pagination.perPage,
                data.pagination.total
              )}{" "}
              of {data.pagination.total}
            </div>
          </div>
        )}

      </div>
    </>
  );
}



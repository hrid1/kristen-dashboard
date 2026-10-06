"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Pencil, Download } from "lucide-react";
import { MeditationsResponse } from "./MeditationsDataType";
import CreateMeditation from "./CreateMeditations";
import MaditatonModalEdit from "./MaditationEditModal";
import ArrowLeftIcon from "@/public/icon/ArrowLeftIcon";
import ArrowRightIcon from "@/public/icon/ArrowRightIcon";
import EditIcon from "@/components/icons/EditIcon";
import { ConfirmModal } from "@/components/Reusable/DeletDialouge";
import { CiPlay1 } from "react-icons/ci";
import { toast } from "sonner";

type MeditationItem = {
  id: string;
  meditation_name: string;
  meditation_description: string;
  meditation_audio: string;
  duration: string | null;
  listenersCount?: number;
};

function AudioButton({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)} 
      />

      <button
        onClick={handlePlay}
        className={`
          relative z-10
          bg-[#C6A664] text-white 
          w-10 h-10 
          rounded-full 
          flex items-center justify-center
          transition-all duration-300
          ${isPlaying ? "animate-pulse ring-4 ring-[#C6A664]/40" : " "}
        `}
      >
        {isPlaying ? "❚❚" : <CiPlay1 />}
      </button>
    </div>
  );
}

export default function MeditationsTable() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedMeditation, setSelectedMeditation] =
    useState<MeditationItem | null>(null);
  const [editModal, setEditModal] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    await axiosPrivate.delete(`/admin/content-management/medi/${selectedDeleteId}`);

    queryClient.invalidateQueries({
      queryKey: ["meditations"],
      exact: false,
    });

    setDeleteModalOpen(false);
    toast.success("Meditaion Delete successfully");
    setSelectedDeleteId(null);
  };


  // ---------------- FETCH ----------------
  const { data, isLoading, isError,refetch } = useQuery<MeditationsResponse>({
    queryKey: ["meditations", page],
    queryFn: async () => {
      const res = await axiosPrivate.get(
        `/admin/content-management/meditations?page=${page}&limit=${limit}`
      );

      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  

  // ---------------- DELETE ----------------
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axiosPrivate.delete(
        `/admin/content-management/medi/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meditations"],
      });
    },
  });

  if (showCreate) {
    return (
      <CreateMeditation
        editData={null}
      
        onBack={() => setShowCreate(false)}
      
      />
      
    );
 
  }

  console.log()
  if (isLoading) return <div>Loading meditations...</div>;
  if (isError) return <div>Failed to load data</div>;

  const meditations = data?.data ?? [];
  const pagination = data?.pagination;
  // console.log(meditations,"dfdfd")
  return (
    <div className="bg-white rounded-xl mt-5 overflow-x-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          List of All Curated Meditations
        </h2>

        <Button onClick={() => setShowCreate(true)} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Meditation
        </Button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-[#1D1F2C]">
          <tr>
            <th className="px-6 py-4 text-left">Meditation Name</th>
            <th className="px-6 py-4 text-center">Listen</th>
            <th className="px-6 py-4 text-left">Duration</th>
            <th className="px-6 py-4 text-left">Listeners</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {meditations.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {item.meditation_name}
              </td>
              {/* <td className="px-6 py-4 font-medium text-gray-900">
                {item.meditation_audio}
              </td> */}
              <td className="px-6 py-4 text-start font-medium text-gray-900">
                <AudioButton src={item?.meditation_audio} />
              </td>

              <td className="px-6 py-4 text-[#1D1F2C]">
                {item.duration || "N/A"}
              </td>

              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-semibold">
                  {item.listenersCount ?? 0}
                </span>
              </td>

              <td className="px-6 py-4 text-right flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedMeditation(item);
                    setEditModal(true);
                  }}
                  className="  cursor-pointer"
                >
                  <EditIcon className=" w-6 h-5" />
                </button>

                <button

                  className="text-red-600 hover:text-red-700 cursor-pointer"
                  onClick={() => {
                    setSelectedDeleteId(item.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editModal && selectedMeditation && (
        <MaditatonModalEdit
          id={selectedMeditation.id}
          open={editModal}
          onOpenChange={setEditModal}
          data={selectedMeditation}
        />
      )}

      {/* ---------------- PAGINATION ---------------- */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">

          {/* Left Side */}
          <div className="flex items-center gap-2">

            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-2 border rounded-md disabled:opacity-40"
            >
              <ArrowLeftIcon />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-1 ${page === pageNumber
                    ? "bg-[#C6A664] text-white rounded"
                    : "text-gray-700"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next */}
            <button
              disabled={page === pagination.totalPages}
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages)
                )
              }
              className="px-3 py-2 border rounded-md disabled:opacity-40"
            >
              <ArrowRightIcon />
            </button>
          </div>

          {/* Right Side */}
          <div className="text-sm text-gray-500">
            Showing{" "}
            {(pagination.page - 1) * pagination.perPage + 1}
            {" to "}
            {Math.min(
              pagination.page * pagination.perPage,
              pagination.total
            )}{" "}
            of {pagination.total} entries
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete this meditation?"
        description="This action cannot be undone."
        onConfirm={() => {
          if (selectedDeleteId) {
            deleteMutation.mutate(selectedDeleteId);
            setDeleteModalOpen(false);
            setSelectedDeleteId(null);
            toast.success("Meditation deleted successfully");
          }
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye } from "lucide-react";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EditDigPage from "../CreateNewDig/ViewDig";
import { ConfirmModal } from "@/components/Reusable/DeletDialouge";
import { CreateDigForm } from "../CreateNewDig/CreateNewDig";
import { toast } from "sonner";
import EditDigModal from "../CreateNewDig/EditDigModal";
import ArrowRightIcon from "@/public/icon/ArrowRightIcon";
import ArrowLeftIcon from "@/public/icon/ArrowLeftIcon";
import EditIcon from "@/components/icons/EditIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/Reusable/Loading";

/* ---------------- TYPES ---------------- */

interface DigLayer {
  id: string;
  question_name: string;
  question_type: string;
  point: number;
}

interface DigItem {
  id: string;
  title: string;
  layers: DigLayer[];
  is_completed: boolean;
}

interface Pagination {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface DigsResponse {
  success: boolean;
  message: string;
  data: DigItem[];
  pagination: Pagination;
}

interface DigTable {
  DIG: string;
  TOTAL: string;
  POINT: string;
  id: string;
  is_completed: boolean;
}

/* ---------------- COMPONENT ---------------- */

export default function ExercisesTable() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedDig, setSelectedDig] = useState<DigTable | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [digType, setDigType] = useState("All");

  /* ---------------- PAGINATION ---------------- */

  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchDigs = async (type: string, requestedPage: number) => {
    const params = new URLSearchParams({
      page: String(requestedPage),
      perPage: String(perPage),
    });
    if (type !== "All") params.set("type", type);

    const res = await axiosPrivate.get<DigsResponse>(
      `/admin/digs?${params.toString()}`,
    );
    return res.data;
  };

  const prefetchDigType = (type: string) => {
    void queryClient.prefetchQuery({
      queryKey: ["digs", 1, perPage, type],
      queryFn: () => fetchDigs(type, 1),
      staleTime: 60_000,
    });
  };

  /* ---------------- FETCH DIG LIST ---------------- */

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<DigsResponse, Error>({
    queryKey: ["digs", page, perPage, digType],
    queryFn: () => fetchDigs(digType, page),
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });

  /* ---------------- FETCH SINGLE DIG FOR EDIT ---------------- */

  const { data: digDetails } = useQuery({
    queryKey: ["dig-details", selectedDig?.id],
    queryFn: async () => {
      if (!selectedDig?.id) return null;
      const res = await axiosPrivate.get(
        `/admin/digs/${selectedDig.id}`
      );
      return res.data;
    },
    enabled: !!selectedDig?.id && editModalOpen,
  });

  /* ---------------- DELETE ---------------- */

  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      const result = await axiosPrivate.delete(
        `/admin/digs/delete/${selectedDeleteId}`
      );

      if (result?.data?.success) {
        toast.success(result?.data?.message);

        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "digs",
        });
      }

      setDeleteModalOpen(false);
      setSelectedDeleteId(null);
    } catch (err) {
      console.error("Failed to delete dig:", err);
    }
  };

  /* ---------------- MAP TABLE DATA ---------------- */

  const tableDataArray: DigTable[] =
    response?.data.map((dig) => ({
      DIG: dig.title,
      TOTAL: dig.layers.length.toString(),
      POINT: dig.layers
        .reduce((sum, layer) => sum + (layer.point || 0), 0)
        .toString(),
      id: dig.id,
      is_completed: dig.is_completed,
    })) || [];

  const pagination = response?.pagination;

  /* ---------------- CONDITIONAL ---------------- */

  if (showCreate) {
    return (
      <CreateDigForm
        onBack={() => setShowCreate(false)}
        breadLink={[
          { label: "List of All Digs", onClick: () => setShowCreate(false) },
          { label: "Create New Dig" },
        ]}
      />
    );
  }

  if (showEdit && selectedDig) {
    return (
      <EditDigPage
        breadLink={[
          { label: "List of All Digs", onClick: () => setShowEdit(false) },
          { label: "Edit Dig" },
        ]}
        onBack={() => setShowEdit(false)}
        digId={selectedDig.id}
      />
    );
  }

  /* ---------------- MAIN TABLE ---------------- */

  return (
    <div className="bg-white rounded-xl mt-5 overflow-x-auto shadow-sm">
      <div className="flex flex-col gap-4 border-b px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h2 className="shrink-0 text-lg font-semibold text-gray-800">
            List of All Digs
          </h2>

          <Tabs
            value={digType}
            onValueChange={(value) => {
              setDigType(value);
              setPage(1);
            }}
          >
            <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0 shadow-none border">
              {[
                "All",
                "Mental_Body",
                "Emotional_Body",
                "Physical_Body",
                "Energy_Body",
              ].map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  onMouseEnter={() => prefetchDigType(type)}
                  onFocus={() => prefetchDigType(type)}
                  className="whitespace-nowrap rounded-md px-3 py-2 text-xs transition-all hover:bg-gray-100 data-[state=active]:bg-[#C6A664] data-[state=active]:text-white"
                >
                  {type.at(0)?.toUpperCase() + type.slice(1).toLowerCase().replace("_", " ")  }
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Dig
        </Button>
      </div>

      {isLoading ? (
        <Loading text="Loading digs..." className="py-12" />
      ) : isError ? (
        <div className="px-6 py-6 text-red-600">Error: {error?.message}</div>
      ) : (
        <>
      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-sm uppercase text-[#1D1F2C]">
          <tr>
            <th className="px-6 py-4 text-left">Dig</th>
            <th className="px-6 py-4 text-left">Total Layer</th>
            <th className="px-6 py-4 text-left">Point</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {tableDataArray.map((dig) => (
            <tr key={dig.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {dig.DIG}
              </td>
              <td className="px-6 py-4 text-[#1F2937]">{dig.TOTAL}</td>
              <td className="px-6 py-4 text-[#1D1F2C]">{dig.POINT}</td>

              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-4">
                  <button
                  
                    onClick={() => {
                      setSelectedDig(dig);
                      setShowEdit(true);
                    }}
                  >
                    <Eye className="h-6 w-5 text-[#777980]" />
                  </button>

                  <button
                 
                    onClick={() => {
                      setSelectedDig(dig);
                      setEditModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </button>

                  <button
                  
                    className="text-red-600"
                    onClick={() => {
                      setSelectedDeleteId(dig.id);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {tableDataArray.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                No digs found
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

      {/* EDIT MODAL */}
      <EditDigModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDig(null);
        }}
        digId={selectedDig?.id ?? null}
        initialData={digDetails?.data}
      />

      {/* DELETE MODAL */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Are you sure you want to delete this Dig?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
        </>
      )}
    </div>
  );
}

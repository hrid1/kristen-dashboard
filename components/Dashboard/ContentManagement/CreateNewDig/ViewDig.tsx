"use client";

import React, { useState } from "react";
import EditIcon from "@/components/icons/EditIcon";
import BreadCrumb from "@/components/Reusable/BreadCrumb";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import EditDigModal from "./EditDigModal";
import { Select } from '@radix-ui/react-select';

// ---------------- TYPES ----------------

interface BreadLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface EditDigPageProps {
  onBack?: () => void;
  breadLink: BreadLink[];
  digId: string;
}

type LayerTitle =
  | "The_Question"
  | "The_Journal"
  | "The_Experience"
  | "The_Reflection";


interface DigLayer {
  id: string;
  question_name: LayerTitle;
  question_type: "Option" | "Text";
  point: number;
  question: string | null;
  options: string[];
  other: boolean;
  other_text: string | null;
  text: string | null;
  correct_answer: string | null;
}

interface DigData {
  id: string;
  title: string;
  layers: DigLayer[];
}

interface DigResponse {
  success: boolean;
  data: DigData;
}

// ---------------- LABEL MAP ----------------

const QUESTION_NAME_LABELS: Record<string, string> = {
  The_Question: "The Question",
  The_Journal: "The Journal",
  The_Experience: "The Experience",
  The_Reflection: "The Reflection",
};

// ---------------- COMPONENT ----------------

export default function EditDigPage({
  breadLink,
  onBack,
  digId,
}: EditDigPageProps) {
  const axiosPrivate = useAxiosPrivate();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<DigResponse, Error>({
    queryKey: ["dig", digId],
    enabled: !!digId,
    queryFn: async () => (await axiosPrivate.get(`/admin/digs/${digId}`)).data,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40 text-[#777980] text-sm">
        Loading...
      </div>
    );

  if (isError)
    return <div className="text-red-600 p-6">Error: {error?.message}</div>;

  if (!response?.data)
    return <div className="text-gray-500 p-6">Dig not found</div>;

  const dig = response.data as DigData;

  // Calculate total XP from all layers
  const totalXP = dig.layers.reduce((sum, layer) => sum + layer.point, 0);

  return (
    <div className="p-6 bg-[#FFFEFA] min-h-screen">
      <BreadCrumb
        breadLink={breadLink.map((link) => ({
          ...link,
          onClick: link.onClick ? link.onClick : () => onBack?.(),
        }))}
      />

      <div className="border border-[#ECEFF3] p-6 rounded-2xl bg-white mt-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#1D1F2C]">
            Dig: {dig.title}
          </h2>

          <div className="flex items-center gap-4">
            {/* Total XP badge */}
            <span className="border border-[#C6A664] text-[#C6A664] px-4 py-2 rounded-full text-sm font-medium">
              Total: {totalXP} XP
            </span>

            <button
              onClick={() => setEditModalOpen(true)}
              className="flex gap-2 items-center text-white bg-[#C6A664] hover:bg-amber-500 transition-colors px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <EditIcon className="text-white w-4 h-4" />
              <span>Edit Dig</span>
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {dig.layers.length === 0 && (
          <div className="text-gray-400 py-12 text-center">
            This Dig has no layers yet.
          </div>
        )}

        {/* LAYERS */}
        {dig.layers.map((layer, index) => (
          <LayerCard key={layer.id} layer={layer} index={index} />
        ))}
      </div>

      {/* EDIT MODAL */}
      <EditDigModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        digId={dig.id}
        initialData={dig}
      />
    </div>
  );
}

// ---------------- LAYER CARD ----------------

interface LayerCardProps {
  layer: DigLayer;
  index: number;
}

function LayerCard({ layer, index }: LayerCardProps) {
  const layerLabel =
    QUESTION_NAME_LABELS[layer.question_name] ?? layer.question_name;
  const displayQuestion = layer.question || layer.question_name;

  return (
    <div className="border border-[#ECEFF3] rounded-xl bg-[#F8FAFB] mt-6 first:mt-0">
      <div className="p-5">
        {/* Layer header */}
        <div className="flex justify-between items-center">
          <button className="py-2 px-5 bg-[#C6A664] rounded-full text-white text-sm font-medium pointer-events-none">
            Layer {String(index + 1).padStart(2, "0")}
          </button>

          <p className="border border-[#C6A664] text-[#C6A664] px-4 py-2 rounded-full text-xs font-medium tracking-wide">
            {layer.point} XP
          </p>
        </div>

        <div className="mt-6">
          {/* Layer type label */}
          <p className="mb-2 text-[#777980] text-sm font-medium">
            {layerLabel}
          </p>

          {/* Main question */}
          <p className="text-[#1D1F2C] text-base font-medium leading-relaxed mb-5">
            {displayQuestion}
          </p>

          {/* Answer options label */}
          <p className="text-[#777980] text-sm font-medium mb-4">
            Answer Options
          </p>

          {/* Option-type answers */}
          {layer.question_type === "Option" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {layer.options.map((option, i) => {
                const isCorrect =
                  !!layer.correct_answer && option === layer.correct_answer;

                return (
                  <label
                    key={i}
                    className={`flex gap-2.5 items-center cursor-pointer select-none ${
                      isCorrect
                        ? "text-[#C6A664] font-medium"
                        : "text-[#1D1F2C]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={layer.id}
                      value={option}
                      defaultChecked={isCorrect}
                      readOnly
                      className="accent-[#C6A664] w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-sm leading-snug">{option}</span>
                  </label>
                );
              })}

              {/* "Other" option */}
              {layer.other && (
                <label className="flex gap-2.5 items-center cursor-pointer select-none text-[#1D1F2C]">
                  <input
                    type="radio"
                    name={layer.id}
                    value="other"
                    readOnly
                    className="accent-[#C6A664] w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm">{layer.other_text || "Other"}</span>
                </label>
              )}
            </div>
          )}

          {/* Text-type answer */}
          {layer.question_type === "Text" && (
            <textarea
              className="w-full p-4 bg-white border border-[#ECEFF3] rounded-xl text-sm text-[#1D1F2C] resize-none focus:outline-none focus:ring-1 focus:ring-[#C6A664]"
              rows={4}
              defaultValue={layer.text || ""}
              placeholder={layer.text || "Enter your journal entry here..."}
              readOnly
            />
          )}

          {/* Correct answer indicator */}
          {layer.question_type === "Option" && layer.correct_answer && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[#C6A664]">
              <span className="inline-flex w-4 h-4 rounded-full bg-[#C6A664] items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Correct answer: <strong>{layer.correct_answer}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

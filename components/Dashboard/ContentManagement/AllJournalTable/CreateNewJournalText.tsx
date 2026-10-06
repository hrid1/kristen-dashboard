"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import BreadCrumb from "@/components/Reusable/BreadCrumb";
import CreateVoiceTab from "./CreateVoiceTab";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface CreateDigForm {
  onBack?: () => void;
  breadLink: { label: string; href?: string; onClick?: () => void }[];
}

/* ---------------- API RESPONSE TYPE ---------------- */
interface JournalResponse {
  success: boolean;
  message: string;
}

export default function CreateNewJournalText({
  onBack,
  breadLink,
}: CreateDigForm) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  /* ---------------- STATE ---------------- */
  const [journalType, setJournalType] = useState<"Text" | "Audio">("Text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audioURL, setAudioURL] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  /* ---------------- TAG HANDLER ---------------- */
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const next = inputValue.trim();
      if (!tags.includes(next)) {
        setTags((prev) => [...prev, next]);
      }
      setInputValue("");
    }
  };
  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }

    setInputValue("");
  };


  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  /* ---------------- MUTATION ---------------- */
  const createJournalMutation = useMutation<
    JournalResponse,
    AxiosError<JournalResponse>
  >({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Please enter a title.");
      }

      if (journalType === "Text" && !body.trim()) {
        throw new Error("Please write your journal body.");
      }

      if (journalType === "Audio" && !audioFile) {
        throw new Error("Please record or upload an audio file.");
      }

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("type", journalType);
      formData.append("tags", JSON.stringify(tags));

      if (journalType === "Text") {
        formData.append("body", body);
      }

      if (journalType === "Audio" && audioFile) {
        formData.append("audio", audioFile);
      }

      const response = await axiosPrivate.post<JournalResponse>(
        "/journels",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });

      setTitle("");
      setBody("");
      setTags(["Gratitude", "Morning"]);
      setInputValue("");
      setAudioURL("");
      setAudioFile(null);
      setJournalType("Text");

      toast.success(data.message || "Journal created successfully");
      onBack?.();
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create journal";

      toast.error(message);
    },
  });

  const isPublishDisabled =
    createJournalMutation.isPending ||
    !title.trim() ||
    (journalType === "Text" && !body.trim()) ||
    (journalType === "Audio" && !audioFile);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen">
      <BreadCrumb breadLink={breadLink} />

      <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-6">
        {/* Header */}
        <div className="flex justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Journal
          </h2>

          <Select
            value={journalType}
            onValueChange={(v) => setJournalType(v as "Text" | "Audio")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-600">Journal Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg p-4"
            placeholder="Morning Reflections"
          />
        </div>

        {/* Body / Audio */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-600">Main Journal</label>

          {journalType === "Audio" ? (
            <CreateVoiceTab
              audioURL={audioURL}
              setAudioURL={setAudioURL}
              setAudioFile={setAudioFile}
            />
          ) : (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="border rounded-md p-4 h-[160px]"
              placeholder="Today I woke up feeling grateful..."
            />
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 border rounded-full px-4 py-3 items-center">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 bg-[#E9FAEE]  px-3 py-1 rounded-md"
            >
              <span>{tag}</span>
              <button type="button" onClick={() => removeTag(tag)} className="cursor-pointer">
                ✕
              </button>
            </div>
          ))}

          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={addTag}
            className="flex-1 min-w-[120px] outline-none bg-transparent"
            placeholder="Press Enter to add tag"
          />

          {/* NEW ADD BUTTON */}
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-[#C6A664] text-white px-3 py-1 rounded-md text-sm hover:opacity-90 cursor-pointer"
          >
            Add
          </button>
        </div>


        {/* Publish */}
        <div className="flex justify-end">
          <button
            onClick={() => createJournalMutation.mutate()}
            disabled={isPublishDisabled}
            className="bg-[#C6A664] text-white px-6 py-3 rounded-lg disabled:opacity-50 cursor-pointer"
          >
            {createJournalMutation.isPending
              ? "Publishing..."
              : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import React, { useState } from "react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import BreadCrumb from "@/components/Reusable/BreadCrumb";
// import CreateVoiceTab from "./CreateVoiceTab";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
// import { toast } from 'sonner';

// interface CreateDigForm {
//   onBack?: () => void;
//   breadLink: { label: string; href?: string; onClick?: () => void }[];
// }

// export default function CreateNewJournalText({ onBack, breadLink }: CreateDigForm) {
//   const axiosPrivate = useAxiosPrivate();
//   const queryClient = useQueryClient();

//   /* ---------------- STATE ---------------- */
//   const [journalType, setJournalType] = useState<"Text" | "Audio">("Text");
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [audioURL, setAudioURL] = useState<string>("");
// const [audioFile, setAudioFile] = useState<File | null>(null);

//   const [tags, setTags] = useState<string[]>(["Gratitude", "Morning"]);
//   const [inputValue, setInputValue] = useState("");

//   /* ---------------- AUDIO FETCH ---------------- */
//   const fetchAudioFile = async (url: string): Promise<File> => {
//   const response = await fetch(url);
//   const blob = await response.blob();
//   return new File([blob], `journal-${Date.now()}.webm`, { type: blob.type });
// };


//   /* ---------------- TAG HANDLER ---------------- */
//   const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && inputValue.trim()) {
//       e.preventDefault();
//       if (!tags.includes(inputValue.trim())) setTags([...tags, inputValue.trim()]);
//       setInputValue("");
//     }
//   };

//   const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

//   /* ---------------- CREATE JOURNAL ---------------- */
//   const createJournalMutation = useMutation({
//   mutationFn: async () => {
//   const formData = new FormData();

//   formData.append("title", title);
//   formData.append("type", journalType);
//   formData.append("tags", JSON.stringify(tags));

//   if (journalType === "Text") {
//     formData.append("body", body);
//   }

//   if (journalType === "Audio") {
//     if (!audioFile) {
//       alert("Please record or upload an audio file.");
//       return;
//     }

//     formData.append("audio", audioFile);
//   }

//   return axiosPrivate.post("/journels", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// },
 
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["journals"] });
//       onBack?.();
//       toast.success("Journal created successfully");
//     },
//   });

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="min-h-screen">
//       <BreadCrumb breadLink={breadLink} />

//       <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-6">
//         {/* Header */}
//         <div className="flex justify-between gap-2">
//           <h2 className="text-xl font-semibold text-gray-800">Create New Journal</h2>

//           <Select
//             value={journalType}
//             onValueChange={(v) => setJournalType(v as "Text" | "Audio")}
//           >
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Select type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Text">Text</SelectItem>
//               <SelectItem value="Audio">Audio</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Title */}
//         <div className="flex flex-col space-y-2">
//           <label className="text-sm text-gray-600">Journal Title</label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="border rounded-lg p-4"
//             placeholder="Morning Reflections"
//           />
//         </div>

//         {/* Body / Audio */}
//         <div className="flex flex-col space-y-2">
//           <label className="text-sm text-gray-600">Main Journal</label>

//          {journalType === "Audio" ? (
//   <CreateVoiceTab
//     audioURL={audioURL}
//     setAudioURL={setAudioURL}
//     setAudioFile={setAudioFile}
//   />
// ) : (
//   <textarea
//     value={body}
//     onChange={(e) => setBody(e.target.value)}
//     className="border rounded-md p-4 h-[160px]"
//     placeholder="Today I woke up feeling grateful..."
//   />
// )}

//         </div>

//         {/* Tags */}
//         <div className="flex flex-col space-y-2">
//           <label className="text-sm font-medium text-gray-600">Journal Tags</label>
//           <div className="flex flex-wrap gap-2 border rounded-full px-4 py-3">
//             {tags.map((tag) => (
//               <div
//                 key={tag}
//                 className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md"
//               >
//                 <span>{tag}</span>
//                 <button onClick={() => removeTag(tag)}>✕</button>
//               </div>
//             ))}
//             <input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={addTag}
//               className="flex-1 outline-none bg-transparent"
//             />
//           </div>
//         </div>

//         {/* Publish */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => createJournalMutation.mutate()}
//             disabled={createJournalMutation.isPending}
//             className="bg-[#C6A664] text-white px-6 py-3 rounded-lg"
//           >
//             {createJournalMutation.isPending ? "Publishing..." : "Publish"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

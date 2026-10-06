"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MeditationItem = {
  id: string;
  meditation_name: string;
  meditation_description: string;
  meditation_audio?: string;
  duration: string | null;
};

type Props = {
  editData?: MeditationItem | null;
  onBack: () => void;
};

export default function CreateMeditation({ editData, onBack }: Props) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Prefill edit
  useEffect(() => {
    if (editData) {
      setTitle(editData.meditation_name || "");
      setDescription(editData.meditation_description || "");
      setDuration(editData.duration || "");
    }
  }, [editData]);

  // Record
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "recorded-audio.webm", {
          type: "audio/webm",
        });
        setRecordedFile(file);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      toast.error("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // 🔥 React Query Mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editData?.id) {
        return axiosPrivate.put(
          `/admin/content-management/medi/${editData.id}`,
          formData
        );
      } else {
        return axiosPrivate.post(
          "/admin/content-management/medi",
          formData
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meditations"] });

      toast.success(
        editData
          ? "Meditation updated successfully"
          : "Meditation created successfully"
      );

      onBack();
    },
    onError: () => {
      toast.error("Submission failed");
    },
  });

  const handleSubmit = () => {
    if (!title) return toast.warning("Title required");
    if (!description) return toast.warning("Description required");
    if (!editData && !recordedFile)
      return toast.warning("Audio file required");

    const formData = new FormData();
    formData.append("meditation_name", title);
    formData.append("meditation_description", description);
    formData.append("duration", duration);

    if (recordedFile) {
      formData.append("audio", recordedFile);
    }

    mutation.mutate(formData);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {editData ? "Edit Meditation" : "Create Meditation"}
        </h2>

        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Meditation Title"
        className="w-full border rounded-lg p-3"
      />

      <textarea
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full border rounded-lg p-3"
      />

      <div className="border rounded-xl flex gap-6 p-4 space-y-4 ">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className="w-full py-2 rounded-lg bg-[#C6A664] text-white"
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setRecordedFile(file);
          }}
          className="
    w-full mt-1
    text-sm text-gray-600
    file:mr-4
    file:py-2
    file:px-4
    file:rounded-lg
    file:border-0
    file:text-sm
    file:font-medium
    file:bg-[#C6A664]
    file:text-white
    file:cursor-pointer
    hover:file:bg-[#b89655]
  "
        />
      </div>

      {recordedFile && (
        <p className="text-sm text-green-600">
          Selected file: {recordedFile.name}
        </p>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : editData
              ? "Update Meditation"
              : "Create Meditation"}
        </Button>
      </div>
    </div>
  );
}


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import useAxiosPrivate from "@/hooks/UseAxiosPrivate";

// type MeditationItem = {
//   id: string;
//   meditation_name: string;
//   meditation_description: string;
//   meditation_audio?: string;
//   duration: string | null;
// };

// type Props = {
//   editData?: MeditationItem | null;
//   onBack: () => void;
// };

// export default function CreateMeditation({
//   editData,
//   onBack,
// }: Props) {
//   const axiosPrivate = useAxiosPrivate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [duration, setDuration] = useState<string>("");

//   const [recordedFile, setRecordedFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<BlobPart[]>([]);

//   // ---------------- PREFILL EDIT MODE ----------------
//   useEffect(() => {
//     if (editData) {
//       setTitle(editData.meditation_name || "");
//       setDescription(editData.meditation_description || "");
//       setDuration(editData.duration || "");
//     }
//   }, [editData]);

//   // ---------------- RECORD AUDIO ----------------
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });

//       const recorder = new MediaRecorder(stream);
//       chunksRef.current = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           chunksRef.current.push(e.data);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(chunksRef.current, {
//           type: "audio/webm",
//         });

//         const file = new File([blob], "recorded-audio.webm", {
//           type: "audio/webm",
//         });

//         setRecordedFile(file);
//       };

//       recorder.start();
//       mediaRecorderRef.current = recorder;
//       setIsRecording(true);
//     } catch {
//       toast.error("Microphone permission denied");
//     }
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setIsRecording(false);
//   };

//   // ---------------- SUBMIT ----------------
//   const handleSubmit = async () => {
//     if (!title) return toast.warning("Title required");
//     if (!description) return toast.warning("Description required");

//     // For create → audio required
//     if (!editData && !recordedFile) {
//       return toast.warning("Audio file required");
//     }

//     try {
//       setIsSubmitting(true);

//       const formData = new FormData();
//       formData.append("meditation_name", title);
//       formData.append("meditation_description", description);
//       formData.append("duration", duration);

//       // Only append file if new one selected
//       if (recordedFile) {
//         formData.append("audio", recordedFile);
//       }

//       if (editData?.id) {
//         await axiosPrivate.put(
//           `/admin/content-management/medi/${editData.id}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         toast.success("Meditation updated successfully");
//       } else {
//         await axiosPrivate.post(
//           "/admin/content-management/medi",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         toast.success("Meditation created successfully");
//       }

//       onBack();
//     } catch {
//       toast.error("Submission failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-sm space-y-3">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">
//           {editData ? "Edit Meditation" : "Create Meditation"}
//         </h2>

//         <Button variant="outline" onClick={onBack} className="cursor-pointer">
//           ← Back
//         </Button>
//       </div>

//       {/* TITLE */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium ">Meditation Title</label>
//         <input
        
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="add maditation title"
//           className="w-full border rounded-lg p-3 mt-2"
//         />
//       </div>

//       {/* DESCRIPTION */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Description</label>
//         <textarea
//           rows={4}
//           value={description}
//           placeholder="Enter Your Description"
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border rounded-lg p-3 mt-2"
//         />
//       </div>

//       {/* DURATION */}
//       {/* <div className="space-y-2">
//         <label className="text-sm font-medium">Duration</label>
//         <input
//           type="text"
//           value={duration}
//           placeholder="Enter Your Duration"
//           onChange={(e) => setDuration(e.target.value)}
//           className="w-full border rounded-lg p-3 mt-2"
//         />
//       </div> */}

//       {/* AUDIO SECTION */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Meditation Audio</label>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
//           {/* RECORD */}
//           <div className="border rounded-xl p-4 space-y-4">
//             <h3 className="font-medium">Record Audio</h3>

//             <button
//               type="button"
//               onClick={isRecording ? stopRecording : startRecording}
//               className={`w-full py-2 rounded-lg text-white cursor-pointer ${
//                 isRecording ? "bg-[#C6A664]" : "bg-[#C6A664]"
//               }`}
//             >
//                {isRecording ? "Stop Recording" : "Start Recording"}
//             </button>

//             {isRecording && (
//               <p className="text-sm text-gray-500">Recording...</p>
//             )}
//           </div>

//           {/* UPLOAD */}
//           <div className="border rounded-xl p-4 space-y-4">
//             <h3 className="font-medium">Upload Recode Audio</h3>

//             <input
//               type="file"
//               accept="audio/*"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) {
//                   setRecordedFile(file);
//                 }
//               }}
//               className="w-full border rounded-lg p-2 cursor-pointer"
//             />

//             <p className="text-xs text-gray-500">
//               You can upload previously downloaded file.
//             </p>
//           </div>
//         </div>

//         {recordedFile && (
//           <p className="text-sm text-green-600 mt-2">
//             Selected file: {recordedFile.name}
//           </p>
//         )}
//       </div>

//       {/* SUBMIT */}
//       <div className="flex justify-end">
//         <Button onClick={handleSubmit} disabled={isSubmitting} className="cursor-pointer">
//           {isSubmitting
//             ? "Saving..."
//             : editData
//             ? "Update Meditation"
//             : "Create Meditation"}
//         </Button>
//       </div>
//     </div>
//   );
// }

// CreateVoiceTab.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CreateVoiceTabProps {
  audioURL: string;
  setAudioURL: (url: string) => void;
  setAudioFile: (file: File | null) => void;
}

export default function CreateVoiceTab({
  audioURL,
  setAudioURL,
  setAudioFile,
}: CreateVoiceTabProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [displayTime, setDisplayTime] = useState("00:00");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRecording) {
      interval = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          const minutes = Math.floor(newDuration / 60)
            .toString()
            .padStart(2, "0");
          const seconds = (newDuration % 60).toString().padStart(2, "0");
          setDisplayTime(`${minutes}:${seconds}`);
          return newDuration;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  /* ---------------- CLEANUP OBJECT URL ---------------- */
  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  /* ---------------- STOP HELPERS ---------------- */
  const stopStreamTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopStreamTracks();
    }
  };

  /* ---------------- START RECORD ---------------- */
  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data?.size) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        // revoke old URL before setting a new one
        if (audioURL) URL.revokeObjectURL(audioURL);

        setAudioFile(file);
        setAudioURL(URL.createObjectURL(file));
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      setDisplayTime("00:00");
    } catch (error) {
      alert("Microphone access denied or unavailable.");
    }
  };

  /* ---------------- FILE UPLOAD ---------------- */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ["mp3", "wav", "webm", "m4a", "ogg"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !validExtensions.includes(extension)) {
      alert("Please upload a valid audio file (mp3, wav, webm, m4a, ogg)");
      return;
    }

    // revoke old URL before setting a new one
    if (audioURL) URL.revokeObjectURL(audioURL);

    setAudioFile(file);
    setAudioURL(URL.createObjectURL(file));
    setDuration(0);
    setDisplayTime("00:00");
  };

  /* ---------------- RESET ---------------- */
  const resetRecording = () => {
    stopRecording();
    stopStreamTracks();

    if (audioURL) URL.revokeObjectURL(audioURL);

    setAudioURL("");
    setAudioFile(null);
    setDuration(0);
    setDisplayTime("00:00");
  };

  /* ---------------- UNMOUNT CLEANUP (safety) ---------------- */
  useEffect(() => {
    return () => {
      stopRecording();
      stopStreamTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full gap-8 items-start">
      {/* RECORD BUTTON */}
      <div
        className="flex flex-col items-center justify-center p-6 border rounded-md min-w-[160px] w-full cursor-pointer select-none"
        onClick={isRecording ? stopRecording : startRecording}
        role="button"
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {!isRecording ? (
          <Mic className="w-12 h-12 text-primary" />
        ) : (
          <Square className="w-12 h-12 text-red-600" />
        )}
        <p className="mt-4 text-lg font-semibold">{displayTime}</p>
        <p className="text-xs text-gray-500 mt-1">
          {isRecording ? "Recording..." : "Tap to record"}
        </p>
      </div>

      {/* UPLOAD */}
      <div className="border rounded-xl p-4 space-y-3 w-full">
        <h3 className="font-medium">Upload Recorded Audio</h3>

        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          disabled={isRecording}
          className="w-full border rounded-lg p-2 disabled:opacity-50"
        />

        <p className="text-xs text-gray-500">You can upload a previously saved audio file.</p>

    
        {/* {audioURL && (
          <Card className="p-4 space-y-3">
            <audio src={audioURL} controls className="w-full" />
            <Button onClick={resetRecording} variant="outline" className="w-full gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </Card>
        )} */}
      </div>
    </div>
  );
}



// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Mic, Square, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// interface CreateVoiceTabProps {
//   audioURL: string;
//   setAudioURL: (url: string) => void;
//   setAudioFile: (file: File | null) => void;
// }

// export default function CreateVoiceTab({
//   audioURL,
//   setAudioURL,
//   setAudioFile,
// }: CreateVoiceTabProps) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [displayTime, setDisplayTime] = useState("00:00");

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   /* ---------------- TIMER ---------------- */
//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isRecording) {
//       interval = setInterval(() => {
//         setDuration((prev) => {
//           const newDuration = prev + 1;
//           const minutes = Math.floor(newDuration / 60)
//             .toString()
//             .padStart(2, "0");
//           const seconds = (newDuration % 60)
//             .toString()
//             .padStart(2, "0");

//           setDisplayTime(`${minutes}:${seconds}`);
//           return newDuration;
//         });
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [isRecording]);

//   /* ---------------- START RECORD ---------------- */
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       const chunks: BlobPart[] = [];

//       mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });

//         const file = new File([blob], `recording-${Date.now()}.webm`, {
//           type: "audio/webm",
//         });

//         setAudioFile(file);
//         setAudioURL(URL.createObjectURL(file));
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//       setDuration(0);
//       setDisplayTime("00:00");
//     } catch (error) {
//       alert("Microphone access denied or unavailable.");
//     }
//   };

//   /* ---------------- STOP RECORD ---------------- */
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);

//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     }
//   };

//   /* ---------------- FILE UPLOAD ---------------- */
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const validExtensions = ["mp3", "wav", "webm", "m4a", "ogg"];
//     const extension = file.name.split(".").pop()?.toLowerCase();

//     if (!extension || !validExtensions.includes(extension)) {
//       alert("Please upload a valid audio file (mp3, wav, webm, m4a, ogg)");
//       return;
//     }

//     setAudioFile(file);
//     setAudioURL(URL.createObjectURL(file));
//   };

//   /* ---------------- RESET ---------------- */
//   const resetRecording = () => {
//     setAudioURL("");
//     setAudioFile(null);
//     setDuration(0);
//     setDisplayTime("00:00");
//   };

//   return (
//     <div className="flex gap-8 items-center">

//       {/* RECORD BUTTON */}
//       <div
//         className="flex flex-col items-center justify-center p-6 border rounded-md min-w-[120px] cursor-pointer select-none w-full"
//         onClick={isRecording ? stopRecording : startRecording}
//       >
//         {!isRecording ? (
//           <Mic className="w-12 h-12 text-primary" />
//         ) : (
//           <Square className="w-12 h-12 text-red-600" />
//         )}

//         <p className="mt-4 text-lg font-semibold">{displayTime}</p>
//       </div>
//       <div className="border rounded-xl p-4 space-y-4">
//         <h3 className="font-medium">Upload Recode Audio</h3>

//         <input
//           type="file"
//           accept="audio/*"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               setRecordedFile(file);
//             }
//           }}
//           className="w-full border rounded-lg p-2"
//         />

//         <p className="text-xs text-gray-500">
//           You can upload previously downloaded file.
//         </p>
//       </div>

//       {/* <div className="flex gap-4  w-full"> */}

      
//         {/* <label className="text-sm text-primary cursor-pointer underline w-fit">
//           Upload Audio File
//           <input
//             type="file"
//             accept="audio/*"
        
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </label> */}

//         {/* AUDIO PREVIEW */}
//         {/* {audioURL && (
//           <Card className="p-4">
//             <audio src={audioURL} controls className="w-full mb-4" />

//             <Button
//               onClick={resetRecording}
//               variant="outline"
//               className="w-full gap-2"
//             >
//               <Trash2 className="w-4 h-4" />
//               Clear
//             </Button>
//           </Card>
//         )} */}
//       {/* </div> */}
//     </div>
//   );
// }

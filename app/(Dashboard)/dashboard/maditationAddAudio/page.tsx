"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import axios from "axios";

export default function MaditaionCreate() {
  const axiosPrivate = useAxiosPrivate();

  // ===== States =====
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [time, setTime] = useState("00:00");
  const [seconds, setSeconds] = useState(0);

  // ===== Refs =====
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ===== Timer =====
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          const m = String(Math.floor(next / 60)).padStart(2, "0");
          const s = String(next % 60).padStart(2, "0");
          setTime(`${m}:${s}`);
          return next;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // ===== Start Recording =====
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };

    mediaRecorder.start();
    setIsRecording(true);
    setSeconds(0);
    setTime("00:00");
  };

  // ===== Stop Recording =====
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
  };

  // ===== Reset =====
  const resetRecording = () => {
    setAudioURL("");
    setAudioBlob(null);
    setSeconds(0);
    setTime("00:00");
  };

  // ===== Publish API =====
  const handlePublish = async () => {
  if (!title || !audioBlob) {
    alert("Meditation name & audio required");
    return;
  }

  const formData = new FormData();
  formData.append("meditation_name", title);
  formData.append("meditation_description", description);
  formData.append("audio", audioBlob, "meditation.webm");


  formData.append("duration", `${Math.ceil(seconds / 60)} minutes`);

  try {
  const res = await axiosPrivate.post(
    "/admin/content-management/medi",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  const data = res.data.data;

  alert(res.data.message);

  setAudioURL(data.meditation_audio);

  // reset form
  setTitle("");
  setDescription("");
  setSeconds(0);
  setTime("00:00");
  setAudioBlob(null);
} catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    alert(err.response?.data?.message || "Upload failed");
  } else if (err instanceof Error) {
    alert(err.message);
  } else {
    alert("Upload failed");
  }
}
};


  // ===== UI =====
  return (
  <div className="p-6">
      <div className="p-6 bg-white rounded-xl border space-y-8">
      <h2 className="text-2xl font-semibold">Create New Meditations</h2>

      {/* Title */}
      <div>
        <label className="text-sm font-medium">Meditations Name</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-2 border rounded-lg px-4 py-3"
          placeholder="Inner Journey: Discovering Your Authentic Self"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-2"
          placeholder="A guided meditation description..."
        />
      </div>

      {/* Recorder */}
      <div>
        <label className="text-sm font-medium">Record Meditation Audio</label>

        <div className="mt-4 flex items-center gap-6 border rounded-xl p-6">
          <div
            onClick={isRecording ? stopRecording : startRecording}
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#F3E8C9] flex items-center justify-center">
              {isRecording ? (
                <Square className="text-red-600" />
              ) : (
                <Mic className="text-[#C6A664]" />
              )}
            </div>

            <span className="mt-2 text-sm font-semibold">{time}</span>
            <span className="text-xs text-gray-500">
              Tap to {isRecording ? "stop" : "record"}
            </span>
          </div>
        </div>
      </div>

      {/* Preview */}
      {audioURL && (
        <div className="border rounded-xl p-4 space-y-3">
          <audio controls src={audioURL} className="w-full" />

          <div className="flex gap-2">
            <Button
              onClick={() => {
                const a = document.createElement("a");
                a.href = audioURL;
                a.download = "meditation.webm";
                a.click();
              }}
            >
              <Play className="w-4 h-4 mr-1" /> Download
            </Button>

            <Button variant="outline" onClick={resetRecording}>
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>
        </div>
      )}

      {/* Publish */}
      <div className="flex justify-end">
        <Button
          onClick={handlePublish}
          className="bg-[#C6A664] text-white px-8"
        >
          Publish
        </Button>
      </div>
    </div>
  </div>
  );
}

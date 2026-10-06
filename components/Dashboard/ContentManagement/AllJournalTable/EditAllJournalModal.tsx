"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { toast } from "sonner";
import { FormProvider } from "react-hook-form";

type JournalEntry = {
  id: string;
  title: string;
  journalType: "Text" | "Audio";
  author: string;
  tags: string[];
  publishDate: string;
  body?: string;
  audio?: string;
};


type Props = {
  open: boolean;
  journal: JournalEntry | null;
  onClose: () => void;
};

export default function EditJournalModal({ open, journal, onClose }: Props) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Text" | "Audio" | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (journal) {
      queueMicrotask(() => {
        setTitle(journal.title);
        setType(journal.journalType);
        setTags(journal.tags || []);
        setAudioUrl(journal.audio || "");
        setTagInput("");
        setAudioFile(null);
      });
    } else {
      queueMicrotask(() => {
        setTitle("");
        setType("");
        setTags([]);
        setAudioUrl("");
        setTagInput("");
        setAudioFile(null);
      });
    }
  }, [journal, open]);

  const handleAddTag = () => {
    const cleaned = tagInput.trim();
    if (!cleaned) return;
    if (tags.includes(cleaned)) {
      toast.warning("Tag already exists!");
      return;
    }
    setTags((prev) => [...prev, cleaned]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleAudioFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      setAudioUrl(""); // clear URL if file is chosen
    }
  };

  const { mutateAsync, isPending } = useMutation({
  mutationFn: async () => {
    if (!journal) return;

    if (type === "Audio" && !audioFile && !audioUrl) {
      toast.warning("Audio file or URL is required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("tags", JSON.stringify(tags));

   if (type === "Text") formData.append("body", journal.body || "");

    if (type === "Audio") {
      if (audioFile) formData.append("audio", audioFile);
      else formData.append("audio", audioUrl);
    }
     console.log(formData)

 return axiosPrivate.patch(`/journels/update/${journal.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
     
  },
  onSuccess: () => {
    toast.success("Journal updated successfully!");
    queryClient.invalidateQueries({ queryKey: ["journals"] });
     
    onClose();
  },
  onError: () => toast.error("Failed to update journal!"),
  
});


  const handleSave = async () => {
    if (!title.trim()) return toast.warning("Title is required!");
    if (!type.trim()) return toast.warning("Type is required!");
    if (type === "Audio" && !audioFile && !audioUrl)
      return toast.warning("Audio file or URL is required!");
    await mutateAsync();
  };

  if (!journal) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Journal</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* TITLE */}
          <div className="space-y-2">
            <Label>Journal Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* TYPE */}
          <div className="space-y-2">
            <Label>Journal Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "Text" | "Audio" | "")}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select type</option>
              <option value="Text">Text</option>
              <option value="Audio">Audio</option>
            </select>
          </div>

          {/* AUDIO INPUT */}
          {type === "Audio" && (
            <div className="space-y-2">
              <Label>Audio File</Label>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                ref={fileInputRef}
                className="hidden"
              />

              {/* Custom Button */}
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                Choose Audio File
              </Button>

              {/* Selected File Name */}
              {audioFile && (
                <p className="text-sm text-gray-500">
                  Selected: {audioFile.name}
                </p>
              )}
            </div>
          )}

          {/* {type === "Audio" && (
            <div className="space-y-2 relative">
              <Label>Audio File</Label>
              <input type="file" accept="audio/*" onChange={handleAudioFileChange} className=""/>
              <span className="absolute right-9"><Upload /></span>
              <Label className="mt-1 text-gray-500 text-sm">or paste audio URL:</Label>
              <Input
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="Audio URL"
              />
            </div>
          )} */}

          {/* TAGS */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Write tag & press Add..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} className="cursor-pointer">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.length ? tags.map(tag => (
                <Badge key={tag} className="rounded-full px-3 py-1 flex items-center gap-2 text-sm">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              )) : <p className="text-xs text-gray-500">No tags added yet.</p>}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={onClose} disabled={isPending} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleSave} disabled={isPending} className="cursor-pointer">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

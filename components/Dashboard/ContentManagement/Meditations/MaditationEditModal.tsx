"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { MeditationItem } from "./MeditationsDataType";
import { toast } from "sonner";

interface MaditatonModalProps {
  id: string;
  data: MeditationItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MaditatonModalEdit({
  id,
  data,
  open,
  onOpenChange,
}: MaditatonModalProps) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    name: data.meditation_name || "",
    description: data.meditation_description || "",
    duration: data.duration || "",
  });

  const [audio, setAudio] = useState<File | null>(null);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("meditation_name", formState.name);
      formData.append("meditation_description", formState.description);
      formData.append("duration", formState.duration);

      if (audio) {
        formData.append("audio", audio);
      }

      const res = await axiosPrivate.patch(
        `/admin/content-management/medi/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("Meditation updated successfully");
      queryClient.invalidateQueries({ queryKey: ["meditations"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Update failed");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Meditation</DialogTitle>
          <DialogDescription>
            Update the meditation details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <label htmlFor="">Name</label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            className="w-full border px-3 mt-2 py-2 rounded"
            placeholder="Meditation Name"
          />

          <label htmlFor="">Description</label>
          <textarea
            value={formState.description}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
            className="w-full mt-2 border px-3 py-2 rounded"
            placeholder="Description"
          />

          {/* <input
            type="text"
            value={formState.duration}
            onChange={(e) =>
              setFormState({ ...formState, duration: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            placeholder="Duration"
          /> */}

<label htmlFor="">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAudio(file);
            }}
            className="w-full mt-2 border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">Cancel</Button>
          </DialogClose>

          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="cursor-pointer"
          >
            {updateMutation.isPending ? "Updating..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

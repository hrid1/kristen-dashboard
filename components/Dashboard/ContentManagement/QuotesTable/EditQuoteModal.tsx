"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Quote {
  id: string;
  quote_text: string;
  quote_author: string;
  reason?: string;
  status: boolean;
  created_at: string;
}

interface EditQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quoteToEdit: Quote | null;
}

export default function EditQuoteDialog({
  isOpen,
  onClose,
  quoteToEdit,
}: EditQuoteDialogProps) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(false);



  
  useEffect(() => {
    if (quoteToEdit && isOpen) {
    
      const id = setTimeout(() => {
        setQuoteText(quoteToEdit.quote_text || "");
        setQuoteAuthor(quoteToEdit.quote_author || "");
        setReason(quoteToEdit.reason || "");
        setStatus(quoteToEdit.status);

      }, 0);

      return () => clearTimeout(id);
    }
  }, [quoteToEdit, isOpen]);

  const handleUpdate = async () => {
    if (!quoteToEdit) return;

    const payload = {
      quote_text: quoteText,
      quote_author: quoteAuthor,
      reason,
    };

    try {
      await axiosPrivate.patch(
        `/quotes/update/${quoteToEdit.id}`,
        payload
      );

      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the quote.");
    }
    toast.success("Quotes update successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>Update the quote details below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <Label>Author</Label>
              <Input
                className="mt-3"
                value={quoteAuthor}
                onChange={(e) => setQuoteAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>

            <Label className="text-sm mt-3">Quote Text</Label>
            <Textarea
              className="mt-3"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              placeholder="Enter the quote..."
            />
          </div>

         

          <div className="flex flex-col">
            <Label>Focus Area / Reason</Label>
            <Input
              className="mt-3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional reason or focus area"
            />
          </div>

          {/* <div className="flex flex-col">
            <Label>Status</Label>
            <select
              className="mt-3 border rounded-lg p-2"
              value={status ? "Active" : "Inactive"}
              onChange={(e) => setStatus(e.target.value === "Active")}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div> */}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!quoteToEdit} className="cursor-pointer">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddQuoteModal({ isOpen, onClose }: Props) {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(true);
  const [type, setType] = useState("");



  const handleSave = async () => {
    await axiosPrivate.post("/quotes", {
      quote_text: quote,
      quote_author: author,
      reason,
      status,
      type: type ? [type] : [""],
      
    });

    queryClient.invalidateQueries({ queryKey: ["quotes"] });

    setQuote("");
    setAuthor("");
    setReason("");
    setStatus(true);
    setType("");



    onClose();
    toast.success("Quotes created successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Quote</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Quote</label>
            <Textarea
            className="mt-2"
            placeholder="Enter Your Quote"
              rows={4}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </div>
          

        <div className="">
            <div className="">
              <label className="text-sm">Author</label>
              <Input
                className="mt-2"
                value={author}
                placeholder="Author"
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            
        </div>

         <div className="flex justify-between gap-5">
          <div className="w-[300px]">
            <label className="text-sm ">Status</label>
           <div className="w-full pt-2">
             <select className="border w-full py-1.5 rounded-sm"
             value={status ? "active" : "inactive"}
             onChange={(e)=> setStatus(e.target.value === "active")}>
              
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>

               
            </select>
           </div>
            
             
      
          </div>
            <div className="w-[250px]">
              <div>
                <label className="text-sm">Type</label>
                <select
                  className="border w-full py-2 rounded-sm mt-2"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Mental_Body">Mental Body</option>
                  <option value="Emotional_Body">Emotional Body</option>
                  <option value="Physical_Body">Physical Body</option>
                  <option value="Energy_Body">Energy Body</option>
                </select>
              </div>



            </div>
       
         </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">
            Save Quote
            
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



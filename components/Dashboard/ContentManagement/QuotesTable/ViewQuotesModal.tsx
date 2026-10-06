"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Quote {
  id: string;
  quote_text: string;
  quote_author: string;
  reason?: string;
  status: boolean;
  created_at: string;
  updated_at:string;
  _count: {
  quoteReactions: number;
};
}

interface ViewQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
}

export default function ViewQuoteModal({ isOpen, onClose, quote }: ViewQuoteModalProps) {
  if (!quote) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quote Details</DialogTitle>
          <DialogDescription>
            View all information related to this quote
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <p>
            <strong>Quote:</strong> {quote.quote_text}
          </p>
          <p>
            <strong>Author:</strong> {quote.quote_author}
          </p>
          <p>
            <strong>Focus Areas:</strong> {quote.reason || "-"}
          </p>
          <p>
            <strong>Status:</strong> {quote.status ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(quote.created_at).toLocaleString()}
          </p>
          <p className=" ">  <strong>count:</strong>
  {quote._count?.quoteReactions ?? 0}
</p>

           <p>
        <strong>update:</strong> {new Date(quote.updated_at).toLocaleString()}

          </p>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// *//
// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import useAxiosPrivate from "@/hooks/UseAxiosPrivate";

// interface Quote {
//   id: string;
//   quote_text: string;
//   quote_author: string;
//   reason?: string;
//   status: boolean;
//   created_at: string;
// }

// interface EditQuoteModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   quote: Quote | null;
//   onUpdated?: (updatedQuote: Quote) => void;
// }

// export default function EditQuoteModal({ isOpen, onClose, quote, onUpdated }: EditQuoteModalProps) {
//   const axiosPrivate = useAxiosPrivate();

//   const [formData, setFormData] = useState({
//     quote_text: quote?.quote_text || "",
//     quote_author: quote?.quote_author || "",
//     reason: quote?.reason || "",
//     status: quote?.status || false,
//   });

//   if (!quote) return null;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await axiosPrivate.patch(`/quotes/${quote.id}`, formData);
//       // Update parent state if needed
//       if (onUpdated) onUpdated(res.data);
//       onClose();
//     } catch (err) {
//       console.error("Failed to update quote", err);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Edit Quote</DialogTitle>
//           <DialogDescription>Update the quote details below</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-3 mt-4">
//           <div>
//             <label className="font-semibold">Quote</label>
//             <textarea
//               name="quote_text"
//               value={formData.quote_text}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Author</label>
//             <input
//               name="quote_author"
//               value={formData.quote_author}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Focus Areas</label>
//             <input
//               name="reason"
//               value={formData.reason}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="status"
//               checked={formData.status}
//               onChange={handleChange}
//             />
//             <label>Status (Active)</label>
//           </div>
//         </div>

//         <DialogFooter className="mt-4 flex justify-end gap-2">
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSubmit}>Update</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// //
"use client";

export type JournalEntry = {
  id: string;
  title: string;   // ✅ match AllJournalTable
  journalType: "Text" | "Audio";
  author: string;
  tags: string[];
  publishDate: string;
  body?: string;
  audio?: string;
};

interface ViewJournalModalProps {
  open: boolean;
  onClose: () => void;
  journal: JournalEntry | null;
}

export default function ViewJournalModal({
  open,
  onClose,
  journal,
}: ViewJournalModalProps) {
  if (!open || !journal) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-[400px] md:w-[600px] max-h-[80vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 right-3 text-sm" onClick={onClose}>
          ✕
        </button>

        <div>
          <h2 className="text-2xl font-semibold mb-2">{journal.title}</h2>

          <p>
            <strong>Type:</strong> {journal.journalType}
          </p>

          <p>
            <strong>Author:</strong> {journal.author}
          </p>

          <p>
            <strong>Tags:</strong>{" "}
            {journal.tags?.length ? journal.tags.join(", ") : "-No Tags-"}
          </p>

          <p>
            <strong>Publish Date:</strong> {journal.publishDate}
          </p>

          <div className="mt-4 border-t pt-4 whitespace-pre-line">
            {journal.body || ""}
          </div>
        </div>
      </div>
    </div>
  );
}



// import { useQuery } from "@tanstack/react-query";
// import useAxiosPrivate from "@/hooks/UseAxiosPrivate";

// export default function ViewJournalModal({
//   open,
//   onClose,
//   journalId, // pass only id
// }: { open: boolean; onClose: () => void; journalId: string | null }) {
//   const axiosPrivate = useAxiosPrivate();

//   const { data: journal, isLoading, isError } = useQuery({
//     queryKey: ["journal", journalId],
//     queryFn: async () => {
//       const res = await axiosPrivate.get(`/journels/${journalId}`);
//       return res.data.data;
//     },
//     enabled: !!journalId && open,
//   });

//   if (!open) return null;

//   return (
//     <div onClick={onClose} className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
//       <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg w-[400px] md:w-[600px] max-h-[80vh] overflow-y-auto relative">
//         <button onClick={onClose} className="absolute top-2 right-3 text-sm">✕</button>

//         {isLoading && <p>Loading...</p>}
//         {isError && <p className="text-red-500">Failed to load journal</p>}

//         {journal && (
//           <>
//             <h2 className="text-2xl font-bold mb-2">{journal.title}</h2>
//             <p><strong>Type:</strong> {journal.type}</p>
//             <p><strong>Author:</strong> {journal.user?.name ?? "-Unknown-"}</p>
//             <p><strong>Tags:</strong> {journal.tags?.join(", ") ?? "-No Tags-"}</p>
//             <p><strong>Publish Date:</strong> {new Date(journal.created_at).toLocaleDateString()}</p>
//             <div className="mt-4 border-t pt-4 whitespace-pre-line">{journal.body ?? "-No Content-"}</div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

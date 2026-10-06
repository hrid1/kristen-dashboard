"use client";

import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export default function BreadCrumb({ breadLink }: { breadLink: BreadLink[] }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartCount, setCartCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]") || [];
      setCartCount(cart.length);
    }
  }, []);

  return (
    <div className="bg-primary-bg">
      <div className="maxContainer py-5">
        <div className="flex items-center gap-2 text-black">
          {breadLink.map((link, index) => {
            const isLast = index === breadLink.length - 1;

            return (
              <div className="flex items-center gap-2" key={index}>
                {/* Show arrow for all except first item */}
                {index !== 0 && (
                  <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                )}

                {/* Make only non-last items clickable */}
                {!isLast && link.onClick ? (
                  <button
                    onClick={link.onClick}
                    className="text-sm sm:text-base font-medium hover:underline"
                  >
                    {link.label}
                  </button>
                ) : (
                  <span className="text-sm sm:text-base font-normal">
                    {link.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { ChevronRight } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// interface BreadLink {
//   label: string;
//   href?: string;
//   onClick?: () => void;
// }

// interface BreadCrumbProps {
//   breadLink: BreadLink[];
// }

// export default function BreadCrumb({ breadLink }: BreadCrumbProps) {
//   return (
//     <div className="bg-primary-bg">
//       <div className="maxContainer py-5">
//         <div className="flex items-center gap-2 text-black">
//           {breadLink.map((link, index) => {
//             const isLast = index === breadLink.length - 1;
//             return (
//               <div className="flex items-center gap-2" key={index}>
//                 {/* Show arrow for all except first item */}
//                 {index !== 0 && (
//                   <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
//                 )}

//                 {link.onClick ? (
//                   <button
//                     onClick={link.onClick}
//                     className={`text-sm sm:text-base font-normal ${
//                       isLast ? "font-bold" : ""
//                     }`}
//                   >
//                     {link.label}
//                   </button>
//                 ) : link.href ? (
//                   <Link
//                     href={link.href}
//                     className={`text-sm sm:text-base font-normal ${
//                       isLast ? "font-bold" : ""
//                     }`}
//                   >
//                     {link.label}
//                   </Link>
//                 ) : (
//                   <span
//                     className={`text-sm sm:text-base font-normal ${
//                       isLast ? "font-bold" : ""
//                     }`}
//                   >
//                     {link.label}
//                   </span>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

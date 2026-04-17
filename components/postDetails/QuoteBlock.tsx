"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import DOMPurify from "dompurify";

export default function QuoteBlock({
  data,
}: {
  data: { text: string; caption?: string };
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sanitize = (content: string) => {
    if (typeof window !== "undefined") return DOMPurify.sanitize(content);
    return content;
  };

  if (!isMounted) {
    return <div className="w-full min-h-[150px] my-4 bg-transparent" />;
  }

  return (
    <div className="my-12 w-full px-2 md:px-0">
      <div className="relative max-w-2xl mx-auto p-8 md:p-6 rounded-2xl bg-white/40 backdrop-blur-md  dark:bg-slate-900/40 ">
        {/* Decorative Quote Icon - Centered at the top */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2  p-2 rounded-full  ">
          <Quote
            className="fill-slate-400 text-slate-400 opacity-80"
            size={24}
          />
        </div>

        <div className="flex flex-col items-center text-center ">
          {/* Using CSS pseudo-elements for quotes so they wrap the HTML cleanly.
            Using « » which are standard in professional Arabic typography.
          */}
          <div
            className="font-serif text-xl lg:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed before:content-['«'] before:mr-1 before:text-slate-400 after:content-['»'] after:ml-1 after:text-slate-400"
            dangerouslySetInnerHTML={{ __html: sanitize(data.text) }}
          />

          {data.caption && (
            <div className="mt-4 md:mt-8 flex items-center gap-x-4 text-muted-foreground/70">
              <div className="h-px w-6 lg:w-8 bg-slate-300 dark:bg-slate-600"></div>

              {/* Editor.js captions can contain formatting, so we sanitize them too */}
              <span
                className="text-sm md:text-base font-medium text-nowrap"
                dangerouslySetInnerHTML={{ __html: sanitize(data.caption) }}
              />
              <div className="h-px w-6 lg:w-8 bg-slate-300 dark:bg-slate-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import { Block } from "@/types/post";
// import { Quote } from "lucide-react";

// export default function QuoteBlock({ data }: Block) {
//   return (
//     <div className="my-8 px-2 md:px-8">
//       <blockquote className="relative flex flex-col gap-y-6 p-6 md:p-8 bg-primary/5 dark:bg-primary/5 rounded-l-2xl border-r-2 border-primary shadow-sm">
//         <Quote
//           className="absolute top-4 right-4 text-primary opacity-20 rotate-180"
//           size={40}
//         />

//         <p
//           className="text-xl md:text-3xl font-serif text-foreground leading-relaxed md:leading-[1.8] pr-6"
//           dangerouslySetInnerHTML={{ __html: data.text }}
//         />

//         {data.caption && (
//           <footer className="flex items-center gap-x-3 mt-2 pr-6">
//             <div className="h-px w-6 bg-primary/50"></div>
//             <cite
//               className="text-sm md:text-base font-medium text-muted-foreground"
//               dangerouslySetInnerHTML={{ __html: data.caption }}
//             />
//           </footer>
//         )}
//       </blockquote>
//     </div>
//   );
// }

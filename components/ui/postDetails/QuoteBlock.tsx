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

import { Block } from "@/types/post";
import { Quote } from "lucide-react";

export default function QuoteBlock({ data }: Block) {
  const html = "”" + data.text + "“";

  return (
    <div className="my-4 px-4">
      <div className="relative max-w-2xl mx-auto p-8 rounded-2xl bg-white/40 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:bg-slate-900/40 dark:shadow-none">
        {/* Decorative Quote Icon */}
        <Quote className=" fill-slate-500 text-slate-500" size={20} />

        <div className="flex flex-col items-center text-center space-y-6">
          <p
            className="font-serif text-xl lg:text-2xl italic text-slate-800 dark:text-slate-100 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {data.caption && (
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-slate-300 dark:bg-slate-600"></div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wider">
                {data.caption}
              </span>
              <div className="h-px w-8 bg-slate-300 dark:bg-slate-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

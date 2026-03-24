import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none placeholder:text-gray-500 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 aria-invalid:ring-red-500/20 aria-invalid:border-red-500 flex field-sizing-content min-h-[80px] w-full rounded-lg border border-white/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-sm shadow-blue-900/5 dark:shadow-black/40 transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white dark:hover:bg-gray-800",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-gray-900 placeholder:text-gray-500 selection:bg-blue-200 selection:text-blue-900 flex h-9 w-full min-w-0 rounded-lg border border-white/50 dark:border-gray-800/50 px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-sm shadow-blue-900/5 dark:shadow-black/40 transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-blue-500/50 focus-visible:ring-[3px] focus-visible:ring-blue-500/20 hover:bg-white dark:hover:bg-gray-800",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

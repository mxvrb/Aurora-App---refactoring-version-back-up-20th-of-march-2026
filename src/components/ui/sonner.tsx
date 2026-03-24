"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  // Detect dark mode from document class to match the app's dark mode system
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <Sonner
      theme={isDarkMode ? "dark" : "light"}
      className="toaster group"
      position="top-center"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          zIndex: 99999,
        } as React.CSSProperties
      }
      toastOptions={{
        // Target description text specifically - make it black in light mode, keep grey in dark mode
        descriptionClassName: isDarkMode ? "text-gray-300" : "text-black",
        // Ensure smooth fade animations
        className: "transition-all duration-500 ease-out",
      }}
      // Enable smooth animations and transitions
      duration={3000}
      closeButton
      richColors
      {...props}
    />
  );
};

export { Toaster };
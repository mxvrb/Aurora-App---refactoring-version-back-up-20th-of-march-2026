import React from 'react';

export default function ThreeDGlasses({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className || "w-6 h-6"}
    >
      <path d="M3 11c0-3.5 1.5-6 4-7" />
      <path d="M21 11c0-3.5-1.5-6-4-7" />
      <rect x="2" y="11" width="8" height="7" rx="1.5" />
      <rect x="14" y="11" width="8" height="7" rx="1.5" />
      <path d="M10 14h4" />
    </svg>
  );
}
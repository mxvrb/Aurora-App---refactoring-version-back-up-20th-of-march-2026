import React from 'react';

interface SpeechBubbleIconProps {
  className?: string;
}

export const SpeechBubbleIcon: React.FC<SpeechBubbleIconProps> = ({ className = "w-4 h-4" }) => {
  return (
    <svg 
      viewBox="0 0 16 16" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main speech bubble body - more rectangular with thicker border */}
      <path
        d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V8C14 8.55228 13.5523 9 13 9H5L2 12V3Z"
        fill="currentColor"
        className="text-gray-600 dark:text-gray-300"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner white area for contrast */}
      <path
        d="M3.5 3.5H12.5V7.5H5.5L3.5 9.5V3.5Z"
        fill="currentColor"
        className="text-white dark:text-gray-700"
      />
      {/* Optional small dots inside to indicate conversation */}
      <circle cx="6" cy="5.5" r="0.5" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
      <circle cx="8" cy="5.5" r="0.5" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
      <circle cx="10" cy="5.5" r="0.5" fill="currentColor" className="text-gray-400 dark:text-gray-500" />
    </svg>
  );
};
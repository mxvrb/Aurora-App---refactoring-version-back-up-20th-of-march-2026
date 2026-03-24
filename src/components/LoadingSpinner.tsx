import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "w-4 h-4" }) => {
  return (
    <div className={`${className} animate-spin-ccw`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer circle with gap - creates the loading spinner effect */}
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="32 12" 
          className="opacity-90"
        />
        {/* Inner accent circle for more visual interest */}
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="16 8"
          className="opacity-60"
        />
      </svg>
    </div>
  );
};
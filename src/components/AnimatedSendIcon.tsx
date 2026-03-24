import React from 'react';

interface AnimatedSendIconProps {
  isLoading: boolean;
  className?: string;
}

export const AnimatedSendIcon: React.FC<AnimatedSendIconProps> = ({ 
  isLoading, 
  className = "w-3.5 h-3.5" 
}) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Loading state - spinning arc */}
        {isLoading && (
          <path
            d="M12 3 A 9 9 0 0 1 21 12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="animate-spin-ccw"
            style={{ transformOrigin: "center center" }}
          />
        )}
        
        {/* Arrow state - upward pointing arrow */}
        {!isLoading && (
          <g className="transition-all duration-200 ease-out">
            {/* Arrow shaft - pointing upward */}
            <path
              d="M12 20 L12 4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Arrow head - pointing upward */}
            <path
              d="M6 10 L12 4 L18 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
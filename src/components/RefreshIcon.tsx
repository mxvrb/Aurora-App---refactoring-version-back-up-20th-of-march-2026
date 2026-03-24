import React from 'react';

interface RefreshIconProps {
  className?: string;
}

export const RefreshIcon: React.FC<RefreshIconProps> = ({ className = "" }) => {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top curved arrow */}
      <path
        d="M4 4.5C4.8 3.2 6.3 2.5 8 2.5C10.5 2.5 12.5 4.5 12.5 7H11.5C11.5 5 9.9 3.5 8 3.5C6.8 3.5 5.7 4.1 5.1 5L6.5 5V6H3.5V3H4.5V4.5Z"
        fill="currentColor"
      />
      
      {/* Bottom curved arrow */}
      <path
        d="M12 11.5C11.2 12.8 9.7 13.5 8 13.5C5.5 13.5 3.5 11.5 3.5 9H4.5C4.5 11 6.1 12.5 8 12.5C9.2 12.5 10.3 11.9 10.9 11L9.5 11V10H12.5V13H11.5V11.5Z"
        fill="currentColor"
      />
    </svg>
  );
};
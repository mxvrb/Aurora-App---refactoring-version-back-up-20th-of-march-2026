import React from 'react';

interface SlidersIconProps {
  className?: string;
}

export const SlidersIcon: React.FC<SlidersIconProps> = ({ className = "w-4 h-4" }) => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Mask to create hollow circles */}
        <mask id="hollow-circle-mask">
          {/* White area will be visible, black area will be transparent */}
          <rect width="20" height="20" fill="white" />
          {/* Black circles create holes */}
          <circle cx="13" cy="5.25" r="1.8" fill="black" />
          <circle cx="7" cy="10" r="1.8" fill="black" />
          <circle cx="10" cy="14.75" r="1.8" fill="black" />
        </mask>
      </defs>
      
      {/* Apply mask to everything - both slider bars and handles */}
      <g mask="url(#hollow-circle-mask)">
        {/* Top slider bar */}
        <rect 
          x="2" 
          y="4.25" 
          width="16" 
          height="2" 
          rx="1" 
          fill="currentColor"
        />
        
        {/* Middle slider bar */}
        <rect 
          x="2" 
          y="9" 
          width="16" 
          height="2" 
          rx="1" 
          fill="currentColor"
        />
        
        {/* Bottom slider bar */}
        <rect 
          x="2" 
          y="13.75" 
          width="16" 
          height="2" 
          rx="1" 
          fill="currentColor"
        />
        
        {/* Top slider handle - positioned towards the right */}
        <circle 
          cx="13" 
          cy="5.25" 
          r="2.8" 
          fill="currentColor"
        />
        
        {/* Middle slider handle - positioned towards the left */}
        <circle 
          cx="7" 
          cy="10" 
          r="2.8" 
          fill="currentColor"
        />
        
        {/* Bottom slider handle - positioned in the middle */}
        <circle 
          cx="10" 
          cy="14.75" 
          r="2.8" 
          fill="currentColor"
        />
      </g>
    </svg>
  );
};
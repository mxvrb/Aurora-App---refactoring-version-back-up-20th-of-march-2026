import React from 'react';

interface ChatWithAIIconProps {
  className?: string;
}

export const ChatWithAIIcon: React.FC<ChatWithAIIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left Speech Bubble (User) */}
      <ellipse 
        cx="7" 
        cy="12" 
        rx="5" 
        ry="4" 
        fill="none" 
        stroke="white" 
        strokeWidth="1.5"
      />
      
      {/* User head icon inside left bubble */}
      <circle 
        cx="7" 
        cy="11.5" 
        r="1.5" 
        fill="white"
      />
      
      {/* Right Speech Bubble (Robot) */}
      <ellipse 
        cx="17" 
        cy="8" 
        rx="5" 
        ry="4" 
        fill="none" 
        stroke="white" 
        strokeWidth="1.5"
      />
      
      {/* Robot head (rectangle) */}
      <rect 
        x="15" 
        y="6.5" 
        width="4" 
        height="3" 
        fill="white"
      />
      
      {/* Robot left eye */}
      <circle 
        cx="16" 
        cy="7.5" 
        r="0.5" 
        fill="black"
      />
      
      {/* Robot right eye */}
      <circle 
        cx="18" 
        cy="7.5" 
        r="0.5" 
        fill="black"
      />
    </svg>
  );
};
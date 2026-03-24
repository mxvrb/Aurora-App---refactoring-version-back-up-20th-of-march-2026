import React, { useState, useEffect } from 'react';

interface AnimatedEyeIconProps {
  isAnimating: boolean;
  className?: string;
}

export const AnimatedEyeIcon: React.FC<AnimatedEyeIconProps> = ({ isAnimating, className = "" }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Eye frames - different stages of blinking
  const eyeFrames = [
    // Frame 0: Fully open eye
    <svg 
      key="open"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="3" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>,
    
    // Frame 1: Slightly closing (eyelids starting to come down)
    <svg 
      key="closing1"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-6 11-6 11 6 11 6s-4 6-11 6-11-6-11-6z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="2.5" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>,
    
    // Frame 2: Half closed
    <svg 
      key="closing2"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-4 11-4 11 4 11 4s-4 4-11 4-11-4-11-4z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="2" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>,
    
    // Frame 3: Almost closed (just a slit)
    <svg 
      key="closing3"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-2 11-2 11 2 11 2s-4 2-11 2-11-2-11-2z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <ellipse 
        cx="12" 
        cy="12" 
        rx="1" 
        ry="0.5" 
        stroke="currentColor" 
        strokeWidth="1.5"
        fill="none"
      />
    </svg>,
    
    // Frame 4: Fully closed (just a line)
    <svg 
      key="closed"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M3 12s4-1 9-1 9 1 9 1s-4 1-9 1-9-1-9-1z" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>,
    
    // Frame 5: Almost closed (opening - same as frame 3)
    <svg 
      key="opening1"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-2 11-2 11 2 11 2s-4 2-11 2-11-2-11-2z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <ellipse 
        cx="12" 
        cy="12" 
        rx="1" 
        ry="0.5" 
        stroke="currentColor" 
        strokeWidth="1.5"
        fill="none"
      />
    </svg>,
    
    // Frame 6: Half open (same as frame 2)
    <svg 
      key="opening2"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-4 11-4 11 4 11 4s-4 4-11 4-11-4-11-4z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="2" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>,
    
    // Frame 7: Almost open (same as frame 1)
    <svg 
      key="opening3"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-6 11-6 11 6 11 6s-4 6-11 6-11-6-11-6z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="2.5" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>,
    
    // Frame 8: Fully open (same as frame 0)
    <svg 
      key="open2"
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="3" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ];

  useEffect(() => {
    if (!isAnimating) {
      setCurrentFrame(0); // Reset to open eye when not animating
      return;
    }

    // Frame timing for natural blink (in milliseconds)
    const frameTiming = [
      50,   // Frame 0->1: Start closing (quick)
      60,   // Frame 1->2: Continue closing 
      70,   // Frame 2->3: Almost closed
      80,   // Frame 3->4: Fully closed (hold briefly)
      100,  // Frame 4->5: Start opening (hold closed longer)
      70,   // Frame 5->6: Continue opening
      60,   // Frame 6->7: Almost open
      50    // Frame 7->8: Fully open
    ];

    let frameIndex = 0;
    const animateFrame = () => {
      if (frameIndex < eyeFrames.length - 1) {
        frameIndex++;
        setCurrentFrame(frameIndex);
        
        setTimeout(animateFrame, frameTiming[frameIndex - 1] || 100);
      } else {
        // Animation complete, reset to open eye
        setCurrentFrame(0);
      }
    };

    // Start animation
    setTimeout(animateFrame, frameTiming[0]);

  }, [isAnimating]);

  return eyeFrames[currentFrame];
};
import React from 'react';

// Legacy component - replaced with VideoTutorialModal
// Kept for backwards compatibility but renders nothing
interface HelpArrowProps {
  isVisible: boolean;
  position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  direction: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';
  text: string;
  className?: string;
  textPosition?: 'above' | 'below' | 'left' | 'right' | 'auto';
  image?: string;
  size?: 'small' | 'medium' | 'normal' | 'large' | 'large-plus' | 'extra-large' | 'huge' | 'massive' | 'enormous' | 'gigantic' | '2x';
}

export const HelpArrow: React.FC<HelpArrowProps> = () => {
  // Component deprecated - video tutorial system is used instead
  return null;
};

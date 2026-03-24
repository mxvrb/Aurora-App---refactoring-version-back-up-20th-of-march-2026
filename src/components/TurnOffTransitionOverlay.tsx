import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power } from 'lucide-react';

interface TurnOffTransitionOverlayProps {
  isVisible: boolean;
  isTurningOn?: boolean;
  xOffset?: string | number;
}

export const TurnOffTransitionOverlay: React.FC<TurnOffTransitionOverlayProps> = ({ 
  isVisible,
  isTurningOn = false,
  xOffset = '0%'
}) => {
  // State to handle color transition
  // If turning on: Start Inactive (Grey), then transition to Active (Black)
  // If turning off: Start Active (Black), then transition to Inactive (Grey)
  const [isActiveColor, setIsActiveColor] = useState(!isTurningOn);

  useEffect(() => {
    if (isVisible) {
      // Reset initial state based on direction
      setIsActiveColor(!isTurningOn);
      
      // Trigger transition after brief delay
      const timer = setTimeout(() => {
        setIsActiveColor(isTurningOn);
      }, 100); // 100ms delay to ensure initial render is seen
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, isTurningOn]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="turn-off-overlay"
          initial={{ opacity: 0, x: xOffset }}
          animate={{ opacity: 1, x: xOffset }}
          exit={{ opacity: 0, x: xOffset }}
          transition={{ 
            opacity: { duration: 0.2 },
            x: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
          }}
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          {/* Clean minimal blur backdrop */}
          <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-md" />
          
          {/* Power Button Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1 
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10"
          >
             {/* The Button Background */}
             <motion.div 
                animate={{ 
                  scale: [1, 0.9], // Press down animation
                }}
                transition={{ 
                  delay: 0.1,
                  duration: 0.15, 
                  ease: "easeInOut",
                  times: [0, 1]
                }}
                // Changed dark:bg-zinc-800 to dark:bg-gray-700 to match the "to do list" (welcome cards) background
                className="w-24 h-24 rounded-[1.5rem] bg-white dark:bg-gray-700 shadow-xl flex items-center justify-center border border-zinc-100 dark:border-gray-600"
             >
                <Power 
                  // Icon Colors:
                  // Light Mode: Active = Black, Inactive = Zinc-400 (Grey)
                  // Dark Mode: Active = White, Inactive = Gray-400
                  className={`w-10 h-10 transition-colors duration-500 ease-in-out ${
                    isActiveColor 
                      ? 'text-black dark:text-white' 
                      : 'text-zinc-400 dark:text-gray-400'
                  }`}
                  strokeWidth={2} 
                />
             </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

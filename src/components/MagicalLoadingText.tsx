import React from 'react';
import { motion } from 'motion/react';

interface MagicalLoadingTextProps {
  children: React.ReactNode;
  isLoading: boolean;
  icon?: React.ReactNode;
}

export const MagicalLoadingText: React.FC<MagicalLoadingTextProps> = ({ children, isLoading, icon }) => {
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (!isLoading) {
    return <>{content}</>;
  }

  return (
    <>
      {/* Dark mode version */}
      <motion.span
        animate={{
          color: [
            'rgb(96, 165, 250)',   // blue-400 (dark mode normal)
            'rgb(147, 197, 253)',  // blue-300 (dark mode hover)
            'rgb(96, 165, 250)',   // blue-400 (dark mode normal)
          ],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden dark:inline-flex items-center gap-1"
      >
        {content}
      </motion.span>
      {/* Light mode version */}
      <motion.span
        animate={{
          color: [
            'rgb(37, 99, 235)',    // blue-600 (light mode normal)
            'rgb(29, 78, 216)',    // blue-700 (light mode hover)
            'rgb(37, 99, 235)',    // blue-600 (light mode normal)
          ],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="inline-flex dark:hidden items-center gap-1"
      >
        {content}
      </motion.span>
    </>
  );
};

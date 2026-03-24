import { motion, AnimatePresence } from 'motion/react';
import LucideCircleArrowLeft from '../imports/LucideCircleArrowLeft';
import LucideCircleArrowRight from '../imports/LucideCircleArrowRight';

interface ToolboxIconProps {
  isOpen: boolean;
  isDarkMode: boolean;
}

export default function ToolboxIcon({ isOpen, isDarkMode }: ToolboxIconProps) {
  // Use currentColor to inherit from parent gradient
  return (
    <div className="w-5 h-5 relative">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="arrow-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
            style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
          >
            <LucideCircleArrowRight />
          </motion.div>
        ) : (
          <motion.div
            key="arrow-left"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
            style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
          >
            <LucideCircleArrowLeft />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

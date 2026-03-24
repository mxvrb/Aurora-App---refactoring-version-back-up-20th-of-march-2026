import React from 'react';
import { motion } from 'motion/react';
import { AcesLogo } from './AcesLogo';

interface LoadingScreenProps {
  error: string | null;
  customLoadingIcon?: string | null;
}

export function LoadingScreen({ error, customLoadingIcon }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [-180, 0, 0],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.6, 1],
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {customLoadingIcon ? (
                <img src={customLoadingIcon} alt="Loading" className="w-16 h-16 rounded-xl object-contain" />
              ) : (
                <AcesLogo className="w-16 h-16" />
              )}
            </motion.div>
          </motion.div>
        </div>
        {error && (
          <div className="mt-8 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm underline"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
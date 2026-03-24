import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import loginVideo from '../assets/login_video.mp4';
import loginFallback from '../assets/login_fallback.jpeg';

interface AnimatedLoginVisualProps {
  showBranding?: boolean;
}

/**
 * Stimulant Login Visual
 * Displays a high-resolution video background with a glassmorphic info card.
 */
export function AnimatedLoginVisual({ showBranding = true }: AnimatedLoginVisualProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Subtle interactive parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#020617] flex items-center justify-center">
      
      {/* Immersive Video Background */}
      <motion.div
        style={{ 
          x: mousePosition.x, 
          y: mousePosition.y,
          scale: 1.05
        }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={loginFallback}
          className="w-full h-full object-cover opacity-80"
        >
          <source src={loginVideo} type="video/mp4" />
          {/* Fallback Image */}
          <img 
            src={loginFallback} 
            alt="Nature Background" 
            className="w-full h-full object-cover"
          />
        </video>
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[#020617]/10" />
      </motion.div>

      {/* Grid Overlay for Texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Minimalist Central Content */}
      <AnimatePresence>
        {showBranding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 p-12 text-left"
          >
            <div className="space-y-2">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-5xl font-light text-white tracking-tight"
              >
                Next-gen <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">AI integration.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-gray-400 text-xl font-light italic"
              >
                Seamlessly intelligent.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
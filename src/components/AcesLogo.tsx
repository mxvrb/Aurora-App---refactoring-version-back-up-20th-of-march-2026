import React from 'react';
import svgPaths from '../imports/svg-9jru882s9u';

interface AcesLogoProps {
  className?: string;
  style?: React.CSSProperties;
  isHovered?: boolean;
  isClicked?: boolean;
}

export function AcesLogo({ className = 'w-10 h-10', style, isHovered = false, isClicked = false }: AcesLogoProps) {
  return (
    <div className={`${className} relative`} style={style}>
      <div className="absolute inset-[0.38%_1%_1%_1%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 334 336">
          <g>
            <path 
              d={svgPaths.p5f0ca00} 
              fill="url(#paint0_linear_1073_222)" 
              className={`transition-all duration-300 ${isHovered ? 'animate-glow-part-1' : ''}`}
              style={{
                filter: isHovered ? 'drop-shadow(0 0 4px rgba(12, 89, 164, 0.4)) brightness(1.15)' : undefined
              }}
            />
            <path 
              d={svgPaths.p2a885d00} 
              fill="url(#paint1_linear_1073_222)" 
              className={`transition-all duration-300 ${isHovered ? 'animate-glow-part-2' : ''}`}
              style={{
                filter: isHovered ? 'drop-shadow(0 0 4px rgba(17, 138, 202, 0.4)) brightness(1.15)' : undefined,
                animationDelay: isHovered ? '0.1s' : undefined
              }}
            />
            <path 
              d={svgPaths.p895040} 
              fill="url(#paint2_linear_1073_222)" 
              className={`transition-all duration-300 ${isHovered ? 'animate-glow-part-3' : ''}`}
              style={{
                filter: isHovered ? 'drop-shadow(0 0 4px rgba(62, 182, 234, 0.4)) brightness(1.15)' : undefined,
                animationDelay: isHovered ? '0.2s' : undefined
              }}
            />
            <path 
              d={svgPaths.p3e940d00} 
              fill="url(#paint3_linear_1073_222)" 
              className={`transition-all duration-300 ${isHovered ? 'animate-glow-part-4' : ''}`}
              style={{
                filter: isHovered ? 'drop-shadow(0 0 4px rgba(82, 212, 190, 0.4)) brightness(1.15)' : undefined,
                animationDelay: isHovered ? '0.3s' : undefined
              }}
            />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1073_222" x1="83.8986" x2="15476.6" y1="168.715" y2="23202.2">
              <stop stopColor="#0C59A4" />
              <stop offset="1" stopColor="#118ACA" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1073_222" x1="-0.00254312" x2="23033.5" y1="86.0183" y2="15478.7">
              <stop stopColor="#118ACA" />
              <stop offset="1" stopColor="#3EB6EA" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1073_222" x1="0" x2="15392.7" y1="2.11429" y2="23035.6">
              <stop stopColor="#3EB6EA" />
              <stop offset="1" stopColor="#52D4BE" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_1073_222" x1="166.6" x2="23200.1" y1="2.11456" y2="15394.8">
              <stop stopColor="#52D4BE" />
              <stop offset="1" stopColor="#43CBB6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <style>{`
        @keyframes glow-part-1 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes glow-part-2 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes glow-part-3 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes glow-part-4 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .animate-glow-part-1 {
          animation: glow-part-1 1.5s ease-in-out infinite;
        }
        .animate-glow-part-2 {
          animation: glow-part-2 1.5s ease-in-out infinite;
        }
        .animate-glow-part-3 {
          animation: glow-part-3 1.5s ease-in-out infinite;
        }
        .animate-glow-part-4 {
          animation: glow-part-4 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
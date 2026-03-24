import svgPaths from "./svg-c61qqbm2bc";

interface VectorProps {
  className?: string;
  stroke?: string;
}

export default function Vector({ className = "w-5 h-5", stroke = "currentColor" }: VectorProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 22 22" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d={svgPaths.pc65b700} id="Vector" />
    </svg>
  );
}
import svgPaths from "./svg-jm2ymjiicj";

interface LucideSparkleProps {
  className?: string;
  stroke?: string;
}

export default function LucideSparkle({ className = "w-5 h-5", stroke = "currentColor" }: LucideSparkleProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d={svgPaths.p3eebfc00} />
    </svg>
  );
}
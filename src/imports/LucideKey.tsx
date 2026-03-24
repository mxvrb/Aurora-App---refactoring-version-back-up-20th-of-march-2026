import svgPaths from "./svg-kjaty7larn";

interface LucideKeyProps {
  className?: string;
  stroke?: string;
}

export default function LucideKey({ className = "w-5 h-5", stroke = "currentColor" }: LucideKeyProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d={svgPaths.p52a4080} />
    </svg>
  );
}
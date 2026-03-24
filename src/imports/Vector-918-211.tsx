import svgPaths from "./svg-jbgspgmuvo";

interface VectorProps {
  className?: string;
  stroke?: string;
}

export default function Vector({ className = "w-5 h-5", stroke = "currentColor" }: VectorProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 21 21" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d={svgPaths.p1edec600} id="Vector" />
    </svg>
  );
}
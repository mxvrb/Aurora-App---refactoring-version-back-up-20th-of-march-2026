import svgPaths from "./svg-d6x3prsbuy";

interface AcesAiLogoIconProps {
  className?: string;
  stroke?: string;
}

export default function AcesAiLogoIcon({ className = "w-5 h-5", stroke = "currentColor" }: AcesAiLogoIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 32 32" stroke={stroke} strokeWidth="2.5">
      <g id="Aces AI Logo Icon">
        <path d={svgPaths.p1ef7fd00} id="Vector" />
      </g>
    </svg>
  );
}
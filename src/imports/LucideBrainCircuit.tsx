import svgPaths from "./svg-20ovmf8wh7";

export default function LucideBrainCircuit({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} data-name="lucide/brain-circuit">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lucide/brain-circuit">
          <path d={svgPaths.p24563680} id="Vector" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
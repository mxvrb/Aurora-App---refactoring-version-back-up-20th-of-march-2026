import svgPaths from "./svg-mi8wsqyzc";

function HandWaveOutline({ className }: { className?: string }) {
  return (
    <div className={className} data-name="hand-wave-outline">
      <div className="absolute inset-[4.167%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
          <path d={svgPaths.p38bf9c00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function HandWaveOutline1() {
  return <HandWaveOutline className="relative size-full" />;
}
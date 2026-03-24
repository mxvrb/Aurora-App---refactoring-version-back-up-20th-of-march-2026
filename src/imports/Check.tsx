import svgPaths from "./svg-y4md7mmnjb";

function Check({ className }: { className?: string }) {
  return (
    <div className={className} data-name="check">
      <div className="absolute inset-[23.29%_12.5%_20.83%_14.58%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 14">
          <path d={svgPaths.p26b70600} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function Check1() {
  return <Check className="relative size-full" />;
}
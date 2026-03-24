import svgPaths from "./svg-esa9l8aurs";

export default function Check({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="check">
      <div className="absolute inset-[23.29%_12.5%_20.83%_14.58%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 13.41">
          <path d={svgPaths.p26b70600} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}
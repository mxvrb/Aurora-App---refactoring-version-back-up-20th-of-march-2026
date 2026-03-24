import svgPaths from "./svg-xsnpil7jmh";

function Language({ className }: { className?: string }) {
  return (
    <div className={className} data-name="language">
      <div className="absolute inset-[39.44%_6.25%_9.37%_49.99%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
          <path d={svgPaths.p1ec24240} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[9.36%_31.24%_21.89%_6.26%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 17">
          <path d={svgPaths.p1c42d3f0} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function Language1() {
  return <Language className="relative size-full" />;
}
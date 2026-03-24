import svgPaths from "./svg-sq3adj40f1";

/**
 * @figmaAssetKey 9139421d86099dd73a7bb07f8bf5ff71e2b94ad1
 */
function MessageTextClockOutline({ className }: { className?: string }) {
  return (
    <div className={className} data-name="message-text-clock-outline">
      <div className="absolute inset-[8.33%_4.17%_4.17%_8.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="Vector">
            <path d={svgPaths.p168f1c80} fill="currentColor" />
            <path d={svgPaths.p244ec800} fill="currentColor" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function MessageTextClockOutline1() {
  return <MessageTextClockOutline className="relative size-full" />;
}
import svgPaths from "./svg-tcq7jfpttl";

function AirplaneTakeoff({ className }: { className?: string }) {
  return (
    <div className={className} data-name="airplane-takeoff">
      <div className="absolute inset-[14.88%_7.83%_12.5%_7.67%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 18">
          <path d={svgPaths.p11c74c40} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function AirplaneTakeoff1() {
  return <AirplaneTakeoff className="relative size-full" />;
}
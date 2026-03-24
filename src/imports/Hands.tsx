import svgPaths from "./svg-1the3cf8t3";

function Hands({ className }: { className?: string }) {
  return (
    <div className={className} data-name="hands">
      <div className="absolute inset-[8.33%_31.25%_54.17%_31.25%]" data-name="Vector">
        <div className="absolute inset-[-11.111%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
            <path d={svgPaths.p13ea4000} id="Vector" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_8.33%_8.34%_9.38%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-5.06%] right-[-5.06%] top-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 21">
            <path d={svgPaths.p15b3bce8} id="Vector" stroke="var(--stroke-0, black)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[91.67%_4.17%_8.33%_4.17%]" data-name="Vector">
        <div className="absolute inset-[-1px_-4.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 2">
            <path d="M1 1H23" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Hands1() {
  return <Hands className="relative size-full" />;
}
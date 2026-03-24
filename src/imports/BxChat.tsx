import svgPaths from "./svg-dmbq3agwb0";

function BxChat({ className }: { className?: string }) {
  return (
    <div className={className} data-name="bx-chat">
      <div className="absolute bottom-[9.31%] left-[8.33%] right-1/4 top-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path d={svgPaths.p27eca190} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bottom-[41.67%] left-1/4 right-[8.33%] top-[8.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12">
          <path d={svgPaths.p3c0d9d00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function BxChat1() {
  return <BxChat className="relative size-full" />;
}
import svgPaths from "./svg-cw0k1d4dx9";

function UserArrows({ className }: { className?: string }) {
  return (
    <div className={className} data-name="user-arrows">
      <div className="absolute inset-[14.79%_3.33%_12.5%_4.17%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 18">
          <path d={svgPaths.p39797000} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function UserArrows1() {
  return <UserArrows className="relative size-full" />;
}
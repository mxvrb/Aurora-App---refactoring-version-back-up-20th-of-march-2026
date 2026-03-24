import svgPaths from "./svg-jsosvaylta";

function UserArrows({ className }: { className?: string }) {
  return (
    <div className={className} data-name="user-arrows">
      <div className="absolute inset-[39.58%_60.42%_31.25%_10.42%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
          <path d={svgPaths.p66ddc40} fill="var(--fill-0, #999999)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[39.58%_10.42%_14.58%_4.17%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 11">
          <path d={svgPaths.p3ad27980} fill="var(--fill-0, #666666)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[63.63%_4.17%_14.58%_54.17%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
          <path d={svgPaths.p14449c00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[14.6%_27.08%_60.42%_27.08%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 6">
          <path d={svgPaths.p22e33f00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function UserArrows1() {
  return <UserArrows className="relative size-full" />;
}
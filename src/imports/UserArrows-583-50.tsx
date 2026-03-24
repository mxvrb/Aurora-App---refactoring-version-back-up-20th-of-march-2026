import svgPaths from "./svg-2oshrdmbt1";

function UserArrows({ className }: { className?: string }) {
  return (
    <div className={className} data-name="user-arrows">
      <div className="absolute inset-[16.69%_4.17%_12.5%_4.17%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 17">
          <path d={svgPaths.p12b1ad80} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function UserArrows1() {
  return <UserArrows className="relative size-full" />;
}
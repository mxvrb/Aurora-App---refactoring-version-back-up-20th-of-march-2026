import svgPaths from "./svg-rzyn270cml";

function UsersCogSolid({ className }: { className?: string }) {
  return (
    <div className={className} data-name="users-cog-solid">
      <div className="absolute bottom-0 left-0 right-0 top-[15.63%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 21">
          <path d={svgPaths.p6987060} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function UsersCogSolid1() {
  return <UsersCogSolid className="relative size-full" />;
}
import svgPaths from "./svg-40zyoj1jx7";
import { imgLucideBan } from "./svg-xbd7p";

function LucideBan() {
  return (
    <div className="absolute inset-[19.74%_21.43%_21.43%_19.74%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6.713px] mask-size-[33.426px_33.425px]" data-name="lucide/ban" style={{ maskImage: `url('${imgLucideBan}')` }}>
      <div className="absolute inset-[-12%]" style={{ willChange: 'auto' }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 18" style={{ transform: 'none' }}>
          <g id="Vector">
            <path clipRule="evenodd" d={svgPaths.p1783a700} fill="var(--fill-0, black)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p1eebd70} fill="var(--fill-0, black)" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute bottom-[1.69%] contents left-0 right-[1.69%] top-0" data-name="Clip path group">
      <LucideBan />
    </div>
  );
}

export default function LucideBan1() {
  return (
    <div className="relative size-full" data-name="lucide_ban 1">
      <ClipPathGroup />
    </div>
  );
}
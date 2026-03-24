import svgPaths from "./svg-wby02jh5o9";
import { imgGroup } from "./svg-1v32y";

function Group1() {
  return (
    <div className="absolute inset-[4.37%_6.17%_4.42%_6.29%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.51px_-1.05px] mask-size-[24px_24px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.01 21.89">
        <g id="Group">
          <path d={svgPaths.p3048bf80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p36843100} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p1fe91e00} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[4.37%_6.17%_4.42%_6.29%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

export default function RobotExpandedOpt() {
  return (
    <div className="relative size-full" data-name="Robot (expanded) opt 2 2">
      <ClipPathGroup />
    </div>
  );
}
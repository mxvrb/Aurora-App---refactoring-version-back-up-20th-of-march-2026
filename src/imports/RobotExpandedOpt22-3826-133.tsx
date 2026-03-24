import svgPaths from "./svg-hfdw5yxje6";
import { imgGroup } from "./svg-r859h";

function Group1() {
  return (
    <div className="absolute inset-[21.67%_11.71%_4.42%_11.46%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2.75px_-5.2px] mask-size-[24px_24px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4391 17.74">
        <g id="Group">
          <path d={svgPaths.p23c64700} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p2219dc00} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p232a9a80} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[21.67%_11.71%_4.42%_11.46%]" data-name="Group">
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
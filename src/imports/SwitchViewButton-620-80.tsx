import svgPaths from "./svg-ysvdzl7g03";

function Icon() {
  return (
    <div className="h-[5.491px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.67%_27.83%_25.76%_20%]" data-name="Vector">
        <div className="absolute inset-[-21.1%_-29.58%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 5">
            <path d={svgPaths.p260d1a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33395" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5.491px] items-start left-[12.4px] top-[3.95px] w-[4.321px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[6.42px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[14.29%_12.11%_24.03%_7.14%]" data-name="Vector">
        <div className="absolute inset-[-17.78%_-6.48%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 6">
            <path d={svgPaths.p24b5bc00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.40815" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.42px] items-start left-[1.83px] top-[5.71px] w-[13.455px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
        <g id="Icon">
          <path d={svgPaths.p9ff580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.32497" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[4.2px] size-[5px] top-[11.3px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[5.464px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.67%_12.04%_25.76%_7.69%]" data-name="Vector">
        <div className="absolute inset-[-22.34%_-6.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 5">
            <path d={svgPaths.pd31ac00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.40557" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5.464px] items-start left-[6.4px] top-[9.53px] w-[12.536px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function RepeatIcon() {
  return (
    <div className="absolute left-[9.32px] size-[21px] top-[9.32px]" data-name="RepeatIcon">
      <Container />
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}

export default function SwitchViewButton() {
  return (
    <div className="bg-[#2b374a] relative rounded-[8.75px] size-full" data-name="SwitchViewButton">
      <div aria-hidden="true" className="absolute border-[#4a5565] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <RepeatIcon />
    </div>
  );
}
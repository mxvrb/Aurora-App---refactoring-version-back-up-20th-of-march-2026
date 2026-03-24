import svgPaths from "./svg-ygymjih4cm";

function Icon() {
  return (
    <div className="relative shrink-0 size-[5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
        <g clipPath="url(#clip0_620_130)" id="Icon">
          <path d={svgPaths.p18a65700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33395" />
        </g>
        <defs>
          <clipPath id="clip0_620_130">
            <rect fill="white" height="5" width="5" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5.491px] items-start left-[11.7px] top-[4.3px] w-[4.321px]" data-name="Container">
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
    <div className="absolute content-stretch flex flex-col items-start left-[4.5px] size-[5px] top-[11.3px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[5.464px] relative shrink-0 w-[12.536px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 6">
        <g id="Icon">
          <path d={svgPaths.p36f60cc0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.40557" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5.464px] items-start left-[6.4px] top-[9.53px]" data-name="Container">
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
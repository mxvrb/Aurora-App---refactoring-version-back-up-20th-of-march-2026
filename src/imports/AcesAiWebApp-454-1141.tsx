import svgPaths from "./svg-9wurmujxfs";

function Icon() {
  return (
    <div className="h-[81px] relative w-[49px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49 81">
        <g id="Icon">
          <path d={svgPaths.pb8f1b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[56px] left-[67px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.5)] top-[68px] w-[151px]" data-name="Container">
      <p className="absolute font-['Segoe_Print:Regular',_sans-serif] h-[56px] leading-[21px] left-[66.5px] not-italic text-[15px] text-center text-white top-[12px] translate-x-[-50%] w-[151px]">Click here to refresh your AI</p>
    </div>
  );
}

function HelpArrow() {
  return (
    <div className="absolute left-[120px] size-0 top-[24px]" data-name="HelpArrow">
      <div className="absolute flex h-[81px] items-center justify-center left-[42px] top-[15px] w-[49px]">
        <div className="flex-none rotate-[180deg]">
          <Icon />
        </div>
      </div>
      <Container />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[71.621px] relative w-[58.944px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 59 72">
        <g id="Icon">
          <path d={svgPaths.pd3e1a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[82px] left-[669px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.5)] top-[-31px] w-[130px]" data-name="Container">
      <p className="absolute font-['Segoe_Print:Regular',_sans-serif] h-[60px] leading-[21px] left-[45px] not-italic text-[15px] text-center text-white top-[22px] translate-x-[-50%] w-[184px]">
        {`This is your To-do list `}
        <br aria-hidden="true" />
        Once finished your bot is ready to chat!
      </p>
      <div className="absolute flex h-[90.236px] items-center justify-center left-[-70.53px] top-[-44.78px] w-[92.672px]">
        <div className="flex-none rotate-[127.188deg]">
          <Icon1 />
        </div>
      </div>
    </div>
  );
}

function HelpArrow1() {
  return (
    <div className="absolute left-[300px] size-0 top-[200px]" data-name="HelpArrow">
      <Container1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[108px] relative w-[107px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 107 108">
        <g id="Icon">
          <path d={svgPaths.p6ca5a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[110px] left-[-37px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.5)] top-[-251.43px] w-[78px]" data-name="Container">
      <p className="absolute font-['Segoe_Print:Regular',_sans-serif] h-[51px] leading-[21px] left-0 not-italic text-[15px] text-center text-white top-[84px] translate-x-[-50%] w-[156px]">Type here your query or changes</p>
    </div>
  );
}

function HelpArrow2() {
  return (
    <div className="absolute left-[300px] size-0 top-[507.43px]" data-name="HelpArrow">
      <div className="absolute flex h-[108px] items-center justify-center left-[-66px] top-[-128.43px] w-[107px]">
        <div className="flex-none rotate-[180deg]">
          <Icon2 />
        </div>
      </div>
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[84px] left-[8.86px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.5)] top-[71px] w-[79.607px]" data-name="Container">
      <p className="absolute font-['Segoe_Print:Regular',_sans-serif] h-[51px] leading-[21px] left-[32px] not-italic text-[15px] text-center text-white top-0 translate-x-[-50%] w-[96px]">Edit your AI manually here</p>
    </div>
  );
}

function HelpArrow3() {
  return (
    <div className="absolute left-[1049.14px] size-0 top-[24px]" data-name="HelpArrow">
      <Container3 />
    </div>
  );
}

export default function AcesAiWebApp() {
  return (
    <div className="bg-white relative size-full" data-name="Aces AI Web App">
      <HelpArrow />
      <HelpArrow1 />
      <HelpArrow2 />
      <HelpArrow3 />
    </div>
  );
}
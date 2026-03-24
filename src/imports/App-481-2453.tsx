import svgPaths from "./svg-g92gkwmn1y";

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1e5fde80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 1.75V4.66667H4.66667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[47.295px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[47.295px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[14px] text-gray-100 text-nowrap top-[-0.86px] whitespace-pre">Refresh</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-[#2b374a] relative rounded-[8.75px] size-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#4a5565] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[7px] items-center pl-[14.571px] pr-[0.571px] py-[0.571px] relative size-full">
          <Icon />
          <Text />
        </div>
      </div>
    </div>
  );
}
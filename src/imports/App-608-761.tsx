import svgPaths from "./svg-ngnrxf503i";

/**
 * @figmaAssetKey f379479f9b68c74d5d8b5b789f927d79c9733d03
 */
function Repeat({ className }: { className?: string }) {
  return (
    <div className={className} data-name="repeat">
      <div className="absolute inset-[22%_26.64%_59.81%_60.31%]" data-name="Vector">
        <div className="absolute inset-[-21.71%_-28.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 6">
            <path d={svgPaths.p23fc4700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49989" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[31.1%_30.99%_46.18%_12.49%]" data-name="Vector">
        <div className="absolute inset-[-17.37%_-6.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 7">
            <path d={svgPaths.pbdc5700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49989" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.37%_61.42%_23.45%_29.88%]" data-name="Vector">
        <div className="absolute inset-[-21.71%_-43.12%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6">
            <path d={svgPaths.pebf2740} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49989" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[49.28%_13.6%_32.54%_34.23%]" data-name="Vector">
        <div className="absolute inset-[-21.71%_-7.19%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 6">
            <path d={svgPaths.p107d2940} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49989" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[47.295px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[47.295px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-[0.43px] not-italic text-[14px] text-nowrap text-white top-[0.5px] whitespace-pre">Switch</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-[#131a2a] relative rounded-[8.75px] size-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#4a5565] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[7px] items-center pl-[14.571px] pr-[0.571px] py-[0.571px] relative size-full">
          <Repeat className="h-[19px] relative shrink-0 w-[20px]" />
          <Text />
        </div>
      </div>
    </div>
  );
}
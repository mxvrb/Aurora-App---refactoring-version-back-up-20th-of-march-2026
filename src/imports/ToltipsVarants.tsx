import svgPaths from "./svg-sh7h78oygf";

function TooltipOriginal() {
  return (
    <div className="absolute bottom-0 left-0 right-[-1px] top-0" data-name="Tooltip_Original">
      <div className="absolute inset-[-18.52%_-3.65%_-37.04%_-3.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 294 84">
          <g id="Tooltip_Original">
            <g filter="url(#filter0_d_601_105)" id="Union">
              <mask fill="white" id="path-1-inside-1_601_105">
                <path d={svgPaths.p1e6ecf00} />
              </mask>
              <path d={svgPaths.p1e6ecf00} fill="var(--fill-0, white)" />
              <path d={svgPaths.p348c1080} fill="var(--stroke-0, #333333)" mask="url(#path-1-inside-1_601_105)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84" id="filter0_d_601_105" width="294" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_601_105" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_601_105" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default function ToltipsVarants() {
  return (
    <div className="relative size-full" data-name="Toltips_varants">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex items-center justify-center px-[17px] py-[12px] relative size-full">
          <TooltipOriginal />
          <div className="font-['SUIT:Medium',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap whitespace-pre">
            <p className="mb-0">Commonly Used Speech Bubbles on the Web</p>
            <p>{` (Tooltips, Chat Bubbles, and More)`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
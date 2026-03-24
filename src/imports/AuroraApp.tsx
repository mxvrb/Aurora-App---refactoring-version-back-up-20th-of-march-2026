import svgPaths from "./svg-j88ycjmqa7";

function Heading() {
  return (
    <div className="absolute h-[35px] left-0 top-[77px] w-[784px]" data-name="Heading 1">
      <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[35px] left-[392.5px] not-italic text-[#101828] text-[31.5px] text-center top-[-2.43px] translate-x-[-50%]">You can add multiple sources to train your Agent</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[24.5px] items-start left-0 top-[126px] w-[784px]" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arial:Regular',sans-serif] leading-[24.5px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[17.5px] text-center">{`Let's start with a file or a link to your site.`}</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[0_0.24%_0.2%_0]" data-name="Group">
      <div className="absolute inset-[50.21%_0.24%_1.19%_26.62%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.1495 26.8455">
          <path d={svgPaths.p10137980} fill="url(#paint0_linear_1189_651)" id="Vector" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1189_651" x1="-0.82324" x2="2530.2" y1="0.000169978" y2="3786.06">
              <stop stopColor="#0C59A4" />
              <stop offset="1" stopColor="#118ACA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[26.95%_50.12%_0.2%_0.29%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.2234 40.242">
          <path d={svgPaths.p2141f200} fill="url(#paint0_linear_1189_643)" id="Vector" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1189_643" x1="-0.157783" x2="3786.22" y1="-0.744151" y2="2528.7">
              <stop stopColor="#118ACA" />
              <stop offset="1" stopColor="#3EB6EA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[0.63%_26.05%_49.79%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.596 27.3903">
          <path d={svgPaths.p39f77180} fill="url(#paint0_linear_1189_698)" id="Vector" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1189_698" x1="0" x2="2531.03" y1="0" y2="3786.06">
              <stop stopColor="#3EB6EA" />
              <stop offset="1" stopColor="#52D4BE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[0_0.76%_26.82%_51.18%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.3782 40.4241">
          <path d={svgPaths.pa7df280} fill="url(#paint0_linear_1189_702)" id="Vector" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1189_702" x1="-0.716104" x2="3785.66" y1="0.347697" y2="2529.79">
              <stop stopColor="#52D4BE" />
              <stop offset="1" stopColor="#43CBB6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[55.241px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function AcesLogo() {
  return (
    <div className="absolute content-stretch flex flex-col h-[55.241px] items-start left-[364.55px] top-[0.21px] w-[54.893px]" data-name="AcesLogo">
      <Icon />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[150.5px] left-0 top-0 w-[784px]" data-name="Container">
      <Heading />
      <Paragraph />
      <AcesLogo />
    </div>
  );
}

function LucideFile() {
  return (
    <div className="absolute contents inset-[8.33%_16.67%]" data-name="lucide/file">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.75 19.25">
            <path d={svgPaths.p3e135e00} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <LucideFile />
    </div>
  );
}

function LucideFile1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[10.5px] size-[21px] top-[10.5px]" data-name="LucideFile">
      <Icon1 />
    </div>
  );
}

function TrainingSourcesStep() {
  return (
    <div className="absolute bg-[#f3f4f6] left-[50.08px] rounded-[19174000px] size-[42px] top-[29.79px]" data-name="TrainingSourcesStep">
      <LucideFile1 />
    </div>
  );
}

function TrainingSourcesStep1() {
  return (
    <div className="absolute h-[21px] left-[60.19px] top-[85.79px] w-[21.795px]" data-name="TrainingSourcesStep">
      <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[21px] left-[11.5px] not-italic text-[#101828] text-[14px] text-center top-[-0.86px] translate-x-[-50%]">File</p>
    </div>
  );
}

function TrainingSourcesStep2() {
  return <div className="absolute left-[114.17px] size-[17.5px] top-[10.5px]" data-name="TrainingSourcesStep" />;
}

function Container1() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.714px] border-solid h-[140px] left-0 rounded-[12.75px] top-0 w-[145.598px]" data-name="Container">
      <TrainingSourcesStep />
      <TrainingSourcesStep1 />
      <TrainingSourcesStep2 />
    </div>
  );
}

function LucideType() {
  return (
    <div className="absolute contents inset-[16.67%]" data-name="lucide/type">
      <div className="absolute inset-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.75 15.75">
            <path d={svgPaths.p6297100} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <LucideType />
    </div>
  );
}

function LucideType1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[10.5px] size-[21px] top-[10.5px]" data-name="LucideType">
      <Icon2 />
    </div>
  );
}

function TrainingSourcesStep3() {
  return (
    <div className="absolute bg-[#f3f4f6] left-[50.08px] rounded-[19174000px] size-[42px] top-[29.79px]" data-name="TrainingSourcesStep">
      <LucideType1 />
    </div>
  );
}

function TrainingSourcesStep4() {
  return (
    <div className="absolute h-[21px] left-[58.14px] top-[85.79px] w-[25.875px]" data-name="TrainingSourcesStep">
      <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[21px] left-[13px] not-italic text-[#101828] text-[14px] text-center top-[-0.86px] translate-x-[-50%]">Text</p>
    </div>
  );
}

function TrainingSourcesStep5() {
  return <div className="absolute left-[114.17px] size-[17.5px] top-[10.5px]" data-name="TrainingSourcesStep" />;
}

function Container2() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.714px] border-solid h-[140px] left-[159.6px] rounded-[12.75px] top-0 w-[145.598px]" data-name="Container">
      <TrainingSourcesStep3 />
      <TrainingSourcesStep4 />
      <TrainingSourcesStep5 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_1189_653)" id="Icon">
          <path d={svgPaths.p36e43200} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p58a13a0} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_1189_653">
            <rect fill="white" height="21" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TrainingSourcesStep6() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex items-center justify-center left-[50.08px] rounded-[19174000px] size-[42px] top-[29.79px]" data-name="TrainingSourcesStep">
      <Icon3 />
    </div>
  );
}

function TrainingSourcesStep7() {
  return (
    <div className="absolute h-[21px] left-[45.51px] top-[85.79px] w-[51.152px]" data-name="TrainingSourcesStep">
      <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[21px] left-[26px] not-italic text-[#101828] text-[14px] text-center top-[-0.86px] translate-x-[-50%]">Website</p>
    </div>
  );
}

function TrainingSourcesStep8() {
  return <div className="absolute left-[114.17px] size-[17.5px] top-[10.5px]" data-name="TrainingSourcesStep" />;
}

function Container3() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.714px] border-solid h-[140px] left-[319.2px] rounded-[12.75px] top-0 w-[145.598px]" data-name="Container">
      <TrainingSourcesStep6 />
      <TrainingSourcesStep7 />
      <TrainingSourcesStep8 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_1189_670)" id="Icon">
          <path d={svgPaths.p16460300} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p1220b880} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M10.5 14.875H10.5088" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_1189_670">
            <rect fill="white" height="21" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TrainingSourcesStep9() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex items-center justify-center left-[50.08px] rounded-[19174000px] size-[42px] top-[29.79px]" data-name="TrainingSourcesStep">
      <Icon4 />
    </div>
  );
}

function TrainingSourcesStep10() {
  return (
    <div className="absolute h-[21px] left-[56.08px] top-[85.79px] w-[30px]" data-name="TrainingSourcesStep">
      <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[21px] left-[15px] not-italic text-[#101828] text-[14px] text-center top-[-0.86px] translate-x-[-50%]">{`Q&A`}</p>
    </div>
  );
}

function TrainingSourcesStep11() {
  return <div className="absolute left-[114.17px] size-[17.5px] top-[10.5px]" data-name="TrainingSourcesStep" />;
}

function Container4() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.714px] border-solid h-[140px] left-[478.79px] rounded-[12.75px] top-0 w-[145.598px]" data-name="Container">
      <TrainingSourcesStep9 />
      <TrainingSourcesStep10 />
      <TrainingSourcesStep11 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1606 24">
        <path d={svgPaths.p7692280} fill="var(--fill-0, #6A7282)" id="Vector" />
      </svg>
    </div>
  );
}

function CibNotion() {
  return (
    <div className="absolute content-stretch flex flex-col h-[24px] items-start left-[10.92px] top-[9px] w-[20.161px]" data-name="CibNotion">
      <Icon5 />
    </div>
  );
}

function TrainingSourcesStep12() {
  return (
    <div className="absolute bg-[#f3f4f6] left-[50.09px] rounded-[19174000px] size-[42px] top-[29.79px]" data-name="TrainingSourcesStep">
      <CibNotion />
    </div>
  );
}

function TrainingSourcesStep13() {
  return (
    <div className="absolute h-[21px] left-[48.91px] top-[85.79px] w-[44.348px]" data-name="TrainingSourcesStep">
      <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[21px] left-[22.5px] not-italic text-[#101828] text-[14px] text-center top-[-0.86px] translate-x-[-50%]">Notion</p>
    </div>
  );
}

function TrainingSourcesStep14() {
  return <div className="absolute left-[114.18px] size-[17.5px] top-[10.5px]" data-name="TrainingSourcesStep" />;
}

function Container5() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[1.714px] border-solid h-[140px] left-[638.39px] rounded-[12.75px] top-0 w-[145.607px]" data-name="Container">
      <TrainingSourcesStep12 />
      <TrainingSourcesStep13 />
      <TrainingSourcesStep14 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[140px] left-0 top-[192.5px] w-[784px]" data-name="Container">
      <Container1 />
      <Container2 />
      <Container3 />
      <Container4 />
      <Container5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[229.88px] size-[14px] top-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91667 7H11.0833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pf23dd00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#155dfc] h-[49px] left-[224px] rounded-[19174000px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[374.5px] w-[336px]" data-name="Button">
      <p className="absolute css-ew64yg font-['Arial:Regular',sans-serif] leading-[24.5px] left-[154.62px] not-italic text-[15.75px] text-center text-white top-[9.39px] translate-x-[-50%]">{`Finish & continue`}</p>
      <Icon6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[423.5px] left-[185.71px] top-[131.96px] w-[784px]" data-name="Container">
      <Container />
      <Container6 />
      <Button />
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[20.83%] left-[20.83%] right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.875 14">
            <path d="M7 13.125L0.875 7L7 0.875" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.88px_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 1.75">
            <path d="M13.125 0.875H0.875" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[28px] pb-0 pt-[7px] px-[7px] rounded-[19174000px] size-[35px] top-[28px]" data-name="Button">
      <Icon7 />
    </div>
  );
}

function TrainingSourcesStep15() {
  return (
    <div className="absolute bg-white h-[687.429px] left-0 top-0 w-[1155.429px]" data-name="TrainingSourcesStep">
      <Container7 />
      <Button1 />
    </div>
  );
}

function PrimitiveDiv() {
  return <div className="absolute bg-[rgba(0,0,0,0.5)] h-[687.429px] left-0 top-0 w-[1155.429px]" data-name="Primitive.div" />;
}

function Icon8() {
  return (
    <div className="absolute left-[72.93px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91667 7H11.0833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 2.91667V11.0833" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#155dfc] h-[31.5px] relative rounded-[6.75px] shrink-0 w-full" data-name="Button">
      <Icon8 />
      <p className="absolute css-ew64yg font-['Arial:Regular',sans-serif] leading-[17.5px] left-[150.43px] not-italic text-[12.25px] text-center text-white top-[5.57px] translate-x-[-50%]">Add New Snippet</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 2.33333V11.6667" id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3eb79a00} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.25 11.6667H8.75" id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[8.75px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[90.955px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute css-ew64yg font-['Arial:Regular',sans-serif] leading-[17.5px] left-0 not-italic text-[#101828] text-[12.25px] top-[-1.43px]">Untitled Snippet</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[14px] relative shrink-0 w-[90.955px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute css-ew64yg font-['Arial:Regular',sans-serif] leading-[14px] left-0 not-italic text-[#99a1af] text-[10.5px] top-[-1.57px]">No content</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-[90.955px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-[129.455px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10.5px] items-center overflow-clip relative rounded-[inherit] size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-white h-[53.643px] relative rounded-[8.75px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#2b7fff] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_0px_0px_1px_rgba(43,127,255,0.2),0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[11.071px] pr-[130.901px] py-[0.571px] relative size-full">
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[299.429px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[14px] items-start overflow-clip pb-0 pt-[14px] px-[14px] relative rounded-[inherit] size-full">
        <Button2 />
        <Container11 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[rgba(249,250,251,0.5)] content-stretch flex flex-col h-[617.536px] items-start left-0 pb-[60.071px] pl-0 pr-[0.571px] pt-[88.071px] top-0 w-[300px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-r-[0.571px] border-solid inset-0 pointer-events-none" />
      <Container12 />
    </div>
  );
}

function Label() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[14px] left-0 not-italic text-[#6a7282] text-[10.5px] top-[-1.57px] tracking-[0.525px] uppercase">Title</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f3f3f5] h-[42px] relative rounded-[6.75px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[10.5px] py-[3.5px] relative size-full">
          <p className="css-ew64yg font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717182] text-[12.25px]">Ex: Refund Policy</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[105.571px] relative shrink-0 w-[594.857px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b-[0.571px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7px] items-start pb-[0.571px] pt-[21px] px-[21px] relative size-full">
        <Label />
        <Input />
      </div>
    </div>
  );
}

function Container15() {
  return <div className="flex-[1_0_0] min-h-px min-w-px w-[594.857px]" data-name="Container" />;
}

function Container16() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[39.071px] h-[617.536px] items-start left-[300px] top-0 w-[594.857px]" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function PrimitiveH() {
  return (
    <div className="content-stretch flex h-[24.5px] items-start relative shrink-0 w-full" data-name="Primitive.h2">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arial:Bold',sans-serif] leading-[24.5px] min-h-px min-w-px not-italic relative text-[#101828] text-[17.5px]">Text Snippets</p>
    </div>
  );
}

function PrimitiveP() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="Primitive.p">
      <p className="absolute css-ew64yg font-['Arial:Regular',sans-serif] leading-[17.5px] left-0 not-italic text-[#6a7282] text-[12.25px] top-[-1.43px]">Add plain text content to train your AI.</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[3.5px] h-[88.071px] items-start left-0 pb-[0.571px] pt-[21px] px-[21px] top-0 w-[299.429px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b-[0.571px] border-solid inset-0 pointer-events-none" />
      <PrimitiveH />
      <PrimitiveP />
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[31.5px] relative rounded-[6.75px] shrink-0 w-[64.607px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[14px] py-[7px] relative size-full">
        <p className="css-ew64yg font-['Arial:Regular',sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#6a7282] text-[12.25px] text-center">Cancel</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#155dfc] h-[31.5px] relative rounded-[6.75px] shrink-0 w-[100px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[14px] py-[7px] relative size-full">
        <p className="css-ew64yg font-['Arial:Regular',sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[12.25px] text-center text-white">Save All</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-white content-stretch flex h-[60.071px] items-start justify-between left-0 pb-0 pt-[14.571px] px-[14px] top-[557.46px] w-[299.429px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t-[0.571px] inset-0 pointer-events-none" />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 2.33333V11.6667" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3eb79a00} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.25 11.6667H8.75" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p1185f200} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24.5px] items-center left-[7px] pl-[10.5px] pr-0 py-0 rounded-[8.75px] top-[7px] w-[52.5px]" data-name="SlotClone">
      <Icon10 />
      <Icon11 />
    </div>
  );
}

function Container19() {
  return <div className="absolute bg-[#d1d5dc] h-[17.5px] left-[70px] top-[10.5px] w-px" data-name="Container" />;
}

function Icon12() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[16.67%] left-1/4 right-[20.83%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 10.5">
            <path d={svgPaths.pd81e600} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[81.5px] pb-0 pt-[5.25px] px-[5.25px] rounded-[3.5px] size-[24.5px] top-[7px]" data-name="ToolbarButton">
      <Icon12 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.67%_20.83%_83.33%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-11.11%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.41667 1.16667">
            <path d="M5.83333 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[83.33%_41.67%_16.67%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-11.11%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.41667 1.16667">
            <path d="M5.83333 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66698 10.5003">
            <path d={svgPaths.p19d78c00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[109.5px] pb-0 pt-[5.25px] px-[5.25px] rounded-[3.5px] size-[24.5px] top-[7px]" data-name="ToolbarButton">
      <Icon13 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.67%_33.33%_66.67%_24.99%]" data-name="Vector">
        <div className="absolute inset-[-25%_-10%_-25.01%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.00092 3.50016">
            <path d={svgPaths.pd131780} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[16.67%] left-1/4 right-1/4 top-1/2" data-name="Vector">
        <div className="absolute inset-[-12.5%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 5.83333">
            <path d={svgPaths.p2047d200} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[16.67%] right-[16.67%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.58px_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 1.16667">
            <path d="M0.583333 0.583333H9.91667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[137.5px] pb-0 pt-[5.25px] px-[5.25px] rounded-[3.5px] size-[24.5px] top-[7px]" data-name="ToolbarButton">
      <Icon14 />
    </div>
  );
}

function Container20() {
  return <div className="absolute bg-[#d1d5dc] h-[17.5px] left-[172.5px] top-[10.5px] w-px" data-name="Container" />;
}

function Icon15() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.83%_87.46%_79.17%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[12.5%] right-[87.46%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[79.17%_87.46%_20.83%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_12.5%_79.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 1.16667">
            <path d="M0.583333 0.583333H8.16667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[33.33%] right-[12.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.58px_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 1.16667">
            <path d="M0.583333 0.583333H8.16667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[79.17%_12.5%_20.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 1.16667">
            <path d="M0.583333 0.583333H8.16667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[184px] pb-0 pt-[5.25px] px-[5.25px] rounded-[3.5px] size-[24.5px] top-[7px]" data-name="ToolbarButton">
      <Icon15 />
    </div>
  );
}

function Container21() {
  return <div className="absolute bg-[#d1d5dc] h-[17.5px] left-[219px] top-[10.5px] w-px" data-name="Container" />;
}

function Icon16() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.61%_8.57%_37.48%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-7.73%_-8.37%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.13378 8.71422">
            <path d={svgPaths.p29b532c0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.48%_41.67%_8.61%_8.57%]" data-name="Vector">
        <div className="absolute inset-[-7.73%_-8.37%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.13378 8.71422">
            <path d={svgPaths.p18260500} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SlotClone1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[230.5px] pb-0 pt-[5.25px] px-[5.25px] rounded-[3.5px] size-[24.5px] top-[7px]" data-name="SlotClone">
      <Icon16 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_33.33%_33.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-50%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.8334 2.33337">
            <path d={svgPaths.p2f07d600} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_62.46%_62.5%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_37.46%_62.5%_62.5%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SlotClone2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[258.5px] pb-0 pt-[5.25px] px-[5.25px] rounded-[3.5px] size-[24.5px] top-[7px]" data-name="SlotClone">
      <Icon17 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-[rgba(249,250,251,0.8)] border-[#f3f4f6] border-b-[0.571px] border-solid h-[39.071px] left-[300px] top-[105.57px] w-[594.857px]" data-name="Container">
      <SlotClone />
      <Container19 />
      <ToolbarButton />
      <ToolbarButton1 />
      <ToolbarButton2 />
      <Container20 />
      <ToolbarButton3 />
      <Container21 />
      <SlotClone1 />
      <SlotClone2 />
    </div>
  );
}

function TextEntryModal() {
  return (
    <div className="absolute h-[617.536px] left-0 overflow-clip top-0 w-[894.857px]" data-name="TextEntryModal">
      <Container13 />
      <Container16 />
      <Container17 />
      <Container18 />
      <Container22 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 8.16667">
            <path d={svgPaths.p755a300} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 8.16667">
            <path d={svgPaths.p4618fa0} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[866.86px] opacity-70 rounded-[1.75px] size-[14px] top-[14px]" data-name="Primitive.button">
      <Icon18 />
    </div>
  );
}

function PrimitiveDiv1() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[0.571px] border-solid h-[618.679px] left-[129.71px] overflow-clip rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[34.38px] w-[896px]" data-name="Primitive.div">
      <TextEntryModal />
      <PrimitiveButton />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <g id="Vector">
            <path d="M7 2.33333V11.6667Z" fill="var(--fill-0, white)" />
            <path d="M7 2.33333V11.6667" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
          <g id="Vector_2">
            <path d={svgPaths.p3eb79a00} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3eb79a00} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
          <g id="Vector_3">
            <path d="M5.25 11.6667H8.75Z" fill="var(--fill-0, white)" />
            <path d="M5.25 11.6667H8.75" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[14px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function TextEntryModal1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[64.018px]" data-name="TextEntryModal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Arial:Regular',sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#101828] text-[12.25px]">Normal text</p>
      </div>
    </div>
  );
}

function TextStyleButton() {
  return (
    <div className="h-[35px] relative rounded-[8.75px] shrink-0 w-[187.857px]" data-name="TextStyleButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[10.5px] py-0 relative size-full">
        <Container23 />
        <TextEntryModal1 />
      </div>
    </div>
  );
}

function TextEntryModal2() {
  return (
    <div className="h-[14px] relative shrink-0 w-[14.08px]" data-name="TextEntryModal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[14px] left-0 not-italic text-[10.5px] text-black top-[-1.57px]">H1</p>
      </div>
    </div>
  );
}

function TextEntryModal3() {
  return (
    <div className="h-[23.429px] relative shrink-0 w-[84.402px]" data-name="TextEntryModal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Arial:Bold',sans-serif] leading-[24.5px] not-italic relative shrink-0 text-[#101828] text-[17.5px]">Heading 1</p>
      </div>
    </div>
  );
}

function TextStyleButton1() {
  return (
    <div className="h-[38.5px] relative rounded-[8.75px] shrink-0 w-[187.857px]" data-name="TextStyleButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[13.955px] pr-[10.5px] py-0 relative size-full">
        <TextEntryModal2 />
        <TextEntryModal3 />
      </div>
    </div>
  );
}

function TextEntryModal4() {
  return (
    <div className="h-[14px] relative shrink-0 w-[14.08px]" data-name="TextEntryModal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[14px] left-0 not-italic text-[10.5px] text-black top-[-1.57px]">H2</p>
      </div>
    </div>
  );
}

function TextEntryModal5() {
  return (
    <div className="h-[21.143px] relative shrink-0 w-[75.973px]" data-name="TextEntryModal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Arial:Bold',sans-serif] leading-[24.5px] not-italic relative shrink-0 text-[#101828] text-[15.75px]">Heading 2</p>
      </div>
    </div>
  );
}

function TextStyleButton2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[8.75px] w-[187.857px]" data-name="TextStyleButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[13.955px] pr-[10.5px] py-0 relative size-full">
        <TextEntryModal4 />
        <TextEntryModal5 />
      </div>
    </div>
  );
}

function TextEntryModal6() {
  return (
    <div className="h-[14px] relative shrink-0 w-[14.08px]" data-name="TextEntryModal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arial:Bold',sans-serif] leading-[14px] left-0 not-italic text-[10.5px] text-black top-[-1.57px]">H3</p>
      </div>
    </div>
  );
}

function TextEntryModal7() {
  return (
    <div className="h-[18.286px] relative shrink-0 w-[67.536px]" data-name="TextEntryModal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Arial:Bold',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Heading 3</p>
      </div>
    </div>
  );
}

function TextStyleButton3() {
  return (
    <div className="h-[35px] relative rounded-[8.75px] shrink-0 w-[187.857px]" data-name="TextStyleButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[13.955px] pr-[10.5px] py-0 relative size-full">
        <TextEntryModal6 />
        <TextEntryModal7 />
      </div>
    </div>
  );
}

function TextEntryModal8() {
  return (
    <div className="content-stretch flex flex-col gap-[1.75px] h-[152.25px] items-start relative shrink-0 w-full" data-name="TextEntryModal">
      <TextStyleButton />
      <TextStyleButton1 />
      <TextStyleButton2 />
      <TextStyleButton3 />
    </div>
  );
}

function PrimitiveDiv2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[160.393px] items-start left-[437.14px] pb-[0.571px] pt-[4.071px] px-[4.071px] rounded-[12.75px] top-[176px] w-[196px]" data-name="Primitive.div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[12.75px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
      <TextEntryModal8 />
    </div>
  );
}

export default function AuroraApp() {
  return (
    <div className="bg-white relative size-full" data-name="Aurora App">
      <TrainingSourcesStep15 />
      <PrimitiveDiv />
      <PrimitiveDiv1 />
      <PrimitiveDiv2 />
    </div>
  );
}
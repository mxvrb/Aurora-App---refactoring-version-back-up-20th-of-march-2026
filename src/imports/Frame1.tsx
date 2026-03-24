import svgPaths from "./svg-9nd5towvhm";
import imgProtectedImg2 from "figma:asset/169b573abbaf94c8982b7cfff18daf9efeee2bc6.png";
import imgProtectedImg3 from "figma:asset/52616a432da32590de2bcc9eea1aab39206d78ea.png";
import imgProtectedImg4 from "figma:asset/6e1f7ff7a0d2aa0a313a90da33aa60053d91ea17.png";
import imgProtectedImg5 from "figma:asset/a292b19e84a1f879f651078f73cedfa89b695975.png";
import imgProtectedImg from "figma:asset/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png";

function ProtectedImg2() {
  return (
    <div className="absolute left-0 size-[84px] top-[-21px]" data-name="ProtectedImg2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg2} />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute left-0 rounded-[1.9174e+07px] size-[17.5px] top-0" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 17.5 17.5\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -1.2374 -1.2374 0 8.75 8.75)\\\'><stop stop-color=\\\'rgba(34,197,94,0.8)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(34,197,94,0.6)\\\' offset=\\\'0.3\\\'/><stop stop-color=\\\'rgba(34,197,94,0.3)\\\' offset=\\\'0.6\\\'/><stop stop-color=\\\'rgba(34,197,94,0.1)\\\' offset=\\\'0.8\\\'/><stop stop-color=\\\'rgba(255,255,255,0)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }}>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[1.9174e+07px]" />
    </div>
  );
}

function Container1() {
  return <div className="absolute bg-[#00c950] left-[5.29px] opacity-[0.524] rounded-[1.9174e+07px] shadow-[0px_0px_8px_0px_rgba(34,197,94,0.8),0px_0px_16px_0px_rgba(34,197,94,0.4)] size-[7px] top-[5.5px]" data-name="Container" />;
}

function Container2() {
  return (
    <div className="absolute left-[70px] size-[17.5px] top-[-24.5px]" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[63px] left-[474.71px] top-[56px] w-[84px]" data-name="Container">
      <ProtectedImg2 />
      <Container2 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[108.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[108.5px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[54.5px] text-[#99a1af] text-[14px] text-center text-nowrap top-[-0.86px] translate-x-[-50%]">
          <p className="leading-[21px] whitespace-pre">Account Number:</p>
        </div>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[100.491px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[100.491px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[50.5px] text-[14px] text-center text-neutral-50 top-[-0.86px] translate-x-[-50%] w-[101px]">
          <p className="leading-[21px]">+971585729686</p>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
            <path d={svgPaths.p324f8c40} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.35%_8.35%_33.32%_33.32%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p3765fa80} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[3.5px] px-[3.5px] relative size-[21px]">
        <Icon />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute box-border content-stretch flex gap-[10.5px] h-[21px] items-center justify-center left-0 pl-0 pr-[0.009px] py-0 top-[140px] w-[1033.43px]" data-name="Container">
      <Text />
      <Text1 />
      <Button />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3b035100} fill="var(--fill-0, #60A5FA)" id="Vector" />
          <path d={svgPaths.p1cdf9080} fill="var(--fill-0, #60A5FA)" id="Vector_2" />
          <path d={svgPaths.p35c2f480} fill="var(--fill-0, #60A5FA)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[#51a2ff] text-[14px] text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Filter</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[21px] items-center left-[21px] top-[196px] w-[56.446px]" data-name="Button">
      <Icon1 />
      <Text2 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[17px] relative shrink-0 w-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 17">
        <g id="Icon">
          <path d={svgPaths.p35120500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#364153] relative rounded-[8.75px] shrink-0 size-[35px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[35px]">
        <Icon2 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[19px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="Icon">
          <path d={svgPaths.p29699900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3f33ac00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="basis-0 bg-[#364153] grow h-[35px] min-h-px min-w-px relative rounded-[8.75px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[35px] items-center justify-center relative w-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[10.5px] h-[35px] items-center left-[476.46px] top-[182px] w-[80.5px]" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function ProtectedImg3() {
  return (
    <div className="h-[23px] relative shrink-0 w-[28px]" data-name="ProtectedImg2">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg3} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[23px] w-[28px]" />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[68.089px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[68.089px]">
        <div className="absolute flex flex-col font-['Arimo:Regular',_sans-serif] font-normal h-[18px] justify-center leading-[0] left-[-0.34px] text-[12.25px] text-white top-[9.25px] translate-y-[-50%] w-[66px]">
          <p className="leading-[17.5px]">Chat with AI</p>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#364153] box-border content-stretch flex gap-[7px] h-[35px] items-center left-[888.34px] pl-[14px] pr-0 py-0 rounded-[8.75px] top-[182px] w-[124.089px]" data-name="Button">
      <ProtectedImg3 />
      <Text3 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-gradient-to-b from-[#030712] h-[231.571px] relative shrink-0 to-[#1e2939] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container3 />
      <Container4 />
      <Button1 />
      <Container5 />
      <Button4 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1ca47800} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3adf9700} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Main Options</p>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[21px] relative shrink-0 w-[114.223px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[114.223px]">
        <Icon4 />
        <Text4 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-0 w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container7 />
      <Icon5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p32dd8c80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3ab04900} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M7.29167 6.5625H5.83333" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 9.47917H5.83333" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 12.3958H5.83333" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Edit Template</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[21px] relative shrink-0 w-[114.268px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[114.268px]">
        <Icon6 />
        <Text5 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App1() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[49.57px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container8 />
      <Icon7 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1968dd00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p20d6b2e0} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p39d7a960} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p31bf6a00} id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Edit Staff</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[21px] relative shrink-0 w-[85.491px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[85.491px]">
        <Icon8 />
        <Text6 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App2() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[99.14px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container9 />
      <Icon9 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3924400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p2c1ea980} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M1.45833 8.75H16.0417" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Select Languages</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[21px] relative shrink-0 w-[137.786px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[137.786px]">
        <Icon10 />
        <Text7 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App3() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[148.71px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container10 />
      <Icon11 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p253c380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p27431980} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Set Reminders</p>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[21px] relative shrink-0 w-[119.161px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[119.161px]">
        <Icon12 />
        <Text8 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App4() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[198.29px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container11 />
      <Icon13 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M8.75 5.10417V15.3125" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3482700} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[21px] relative shrink-0 w-[192.241px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[192.241px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Text to Text Booking Directory</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[21px] relative shrink-0 w-[220.241px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[220.241px]">
        <Icon14 />
        <Text9 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App5() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[247.86px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container12 />
      <Icon15 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M5.83333 1.45833V4.375" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 1.45833V4.375" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p2ef46e0} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M2.1875 7.29167H15.3125" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[21px] relative shrink-0 w-[146.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[146.625px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Google Calendar Setup</p>
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[21px] relative shrink-0 w-[174.625px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[174.625px]">
        <Icon16 />
        <Text10 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App6() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[297.43px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container13 />
      <Icon17 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M5.83333 1.45833V4.375" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 1.45833V4.375" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p2ef46e0} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M2.1875 7.29167H15.3125" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Outlook Calendar Setup</p>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[21px] relative shrink-0 w-[180.152px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[180.152px]">
        <Icon18 />
        <Text11 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App7() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[347px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container14 />
      <Icon19 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p7dc7400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[21px] relative shrink-0 w-[124.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[124.438px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Set Google Reviews</p>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[21px] relative shrink-0 w-[152.438px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[152.438px]">
        <Icon20 />
        <Text12 />
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App8() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[396.57px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container15 />
      <Icon21 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p33681bf0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Integrate Follow-Ups</p>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[21px] relative shrink-0 w-[161.455px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[161.455px]">
        <Icon22 />
        <Text13 />
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App9() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[446.14px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container16 />
      <Icon23 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3a225d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M1.45833 7.29167H16.0417" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Add Payment Links</p>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[21px] relative shrink-0 w-[149.295px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[149.295px]">
        <Icon24 />
        <Text14 />
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App10() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[495.71px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container17 />
      <Icon25 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p25177d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3ca72c00} fill="var(--fill-0, #99A1AF)" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p242ca900} fill="var(--fill-0, #99A1AF)" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p34335470} fill="var(--fill-0, #99A1AF)" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p19a41b00} fill="var(--fill-0, #99A1AF)" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">White Label</p>
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[21px] relative shrink-0 w-[103.277px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[103.277px]">
        <Icon26 />
        <Text15 />
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App11() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[545.29px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Container18 />
      <Icon27 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[594.857px] left-0 top-0 w-[1033.43px]" data-name="Container">
      <App />
      <App1 />
      <App2 />
      <App3 />
      <App4 />
      <App5 />
      <App6 />
      <App7 />
      <App8 />
      <App9 />
      <App10 />
      <App11 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pb7db280} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3adf9700} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[21px] relative shrink-0 w-[86.223px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[86.223px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Main Options</p>
        </div>
      </div>
    </div>
  );
}

function App12() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center left-0 pb-[0.571px] pl-[21px] pr-0 pt-0 top-0 w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Icon28 />
      <Icon29 />
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[21px] relative shrink-0 w-[104.545px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[104.545px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Configure Name</p>
        </div>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[21px] relative shrink-0 w-[116.83px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[116.83px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">{`Rachel's Hair Salon`}</p>
        </div>
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[21px] relative shrink-0 w-[141.33px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[21px] items-center relative w-[141.33px]">
        <Text18 />
        <Icon30 />
      </div>
    </div>
  );
}

function App13() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[49.57px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Text17 />
      <Container20 />
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[21px] relative shrink-0 w-[48.723px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[48.723px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Edit Bio</p>
        </div>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App14() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[99.14px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Text19 />
      <Icon31 />
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[21px] relative shrink-0 w-[167.964px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[167.964px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Change Business Category</p>
        </div>
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[21px] relative shrink-0 w-[124.268px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[124.268px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">{`Women's Hair Salon`}</p>
        </div>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[21px] relative shrink-0 w-[148.768px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[21px] items-center relative w-[148.768px]">
        <Text21 />
        <Icon32 />
      </div>
    </div>
  );
}

function App15() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[148.71px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Text20 />
      <Container21 />
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[21px] relative shrink-0 w-[81.268px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[81.268px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Add Website</p>
        </div>
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function App16() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[198.29px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Text22 />
      <Icon33 />
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[21px] relative shrink-0 w-[101.857px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[101.857px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Choose Model...</p>
        </div>
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[21px] relative shrink-0 w-[24.786px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[24.786px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">GPT</p>
        </div>
      </div>
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #F3F4F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[21px] relative shrink-0 w-[49.286px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[21px] items-center relative w-[49.286px]">
        <Text24 />
        <Icon34 />
      </div>
    </div>
  );
}

function App17() {
  return (
    <div className="absolute bg-[#1e2939] box-border content-stretch flex h-[49.571px] items-center justify-between left-0 pb-[0.571px] pt-0 px-[21px] top-[247.86px] w-[1033.43px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <Text23 />
      <Container22 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-[#1e2939] h-[594.857px] left-[1033.43px] top-0 w-[1033.43px]" data-name="Container">
      <App12 />
      <App13 />
      <App14 />
      <App15 />
      <App16 />
      <App17 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p32dd8c80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3ab04900} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M7.29167 6.5625H5.83333" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 9.47917H5.83333" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 12.3958H5.83333" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[21px] relative shrink-0 w-[86.268px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[86.268px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Edit Template</p>
        </div>
      </div>
    </div>
  );
}

function App18() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon35 />
          <Icon36 />
          <Text25 />
        </div>
      </div>
    </div>
  );
}

function App19() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[517.13px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Template editing options will be available here.</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App18 />
      <App19 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1968dd00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.peb81300} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p39d7a960} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p31bf6a00} id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[21px] relative shrink-0 w-[57.491px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[57.491px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Edit Staff</p>
        </div>
      </div>
    </div>
  );
}

function App20() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon37 />
          <Icon38 />
          <Text26 />
        </div>
      </div>
    </div>
  );
}

function App21() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[517.11px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Staff management options will be available here.</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App20 />
      <App21 />
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3924400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p2c1ea980} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M1.45833 8.75H16.0417" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[21px] relative shrink-0 w-[109.786px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[109.786px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Select Languages</p>
        </div>
      </div>
    </div>
  );
}

function App22() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon39 />
          <Icon40 />
          <Text27 />
        </div>
      </div>
    </div>
  );
}

function App23() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[516.74px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Language selection options will be available here.</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App22 />
      <App23 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1dd1d940} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p27431980} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[21px] relative shrink-0 w-[91.161px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[91.161px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Set Reminders</p>
        </div>
      </div>
    </div>
  );
}

function App24() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon41 />
          <Icon42 />
          <Text28 />
        </div>
      </div>
    </div>
  );
}

function App25() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[516.9px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Reminder configuration options will be available here.</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App24 />
      <App25 />
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M8.75 5.10417V15.3125" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3482700} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[21px] relative shrink-0 w-[192.241px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[192.241px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Text to Text Booking Directory</p>
        </div>
      </div>
    </div>
  );
}

function App26() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon43 />
          <Icon44 />
          <Text29 />
        </div>
      </div>
    </div>
  );
}

function App27() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[516.92px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Booking directory setup options will be available here.</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App26 />
      <App27 />
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M5.83333 1.45833V4.375" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 1.45833V4.375" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p2ef46e0} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M2.1875 7.29167H15.3125" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[21px] relative shrink-0 w-[146.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[146.625px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Google Calendar Setup</p>
        </div>
      </div>
    </div>
  );
}

function App28() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon45 />
          <Icon46 />
          <Text30 />
        </div>
      </div>
    </div>
  );
}

function App29() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[517.67px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Google Calendar integration options will be available here.</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App28 />
      <App29 />
    </div>
  );
}

function Icon47() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon48() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M5.83333 1.45833V4.375" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M11.6667 1.45833V4.375" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p2ef46e0} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M2.1875 7.29167H15.3125" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[21px] relative shrink-0 w-[152.152px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[152.152px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Outlook Calendar Setup</p>
        </div>
      </div>
    </div>
  );
}

function App30() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon47 />
          <Icon48 />
          <Text31 />
        </div>
      </div>
    </div>
  );
}

function App31() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[516.66px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Outlook Calendar integration options will be available here.</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App30 />
      <App31 />
    </div>
  );
}

function Icon49() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon50() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3cf81800} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[21px] relative shrink-0 w-[124.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[124.438px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Set Google Reviews</p>
        </div>
      </div>
    </div>
  );
}

function App32() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon49 />
          <Icon50 />
          <Text32 />
        </div>
      </div>
    </div>
  );
}

function App33() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[517.62px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Google Reviews integration options will be available here.</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App32 />
      <App33 />
    </div>
  );
}

function Icon51() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon52() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p99402f0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[21px] relative shrink-0 w-[133.455px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[133.455px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Integrate Follow-Ups</p>
        </div>
      </div>
    </div>
  );
}

function App34() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon51 />
          <Icon52 />
          <Text33 />
        </div>
      </div>
    </div>
  );
}

function App35() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[516.95px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Follow-up integration options will be available here.</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App34 />
      <App35 />
    </div>
  );
}

function Icon53() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon54() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3a225d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d="M1.45833 7.29167H16.0417" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[21px] relative shrink-0 w-[121.295px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[121.295px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Add Payment Links</p>
        </div>
      </div>
    </div>
  );
}

function App36() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon53 />
          <Icon54 />
          <Text34 />
        </div>
      </div>
    </div>
  );
}

function App37() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[517.04px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">Payment link configuration options will be available here.</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App36 />
      <App37 />
    </div>
  );
}

function Icon55() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p398b0380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Icon56() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p25177d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p3ca72c00} fill="var(--fill-0, #99A1AF)" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p242ca900} fill="var(--fill-0, #99A1AF)" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p34335470} fill="var(--fill-0, #99A1AF)" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p19a41b00} fill="var(--fill-0, #99A1AF)" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[21px] relative shrink-0 w-[75.277px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[75.277px]">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">White Label</p>
        </div>
      </div>
    </div>
  );
}

function App38() {
  return (
    <div className="bg-[#1e2939] h-[49.571px] relative shrink-0 w-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#364153] border-[0px_0px_0.571px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[49.571px] items-center pb-[0.571px] pl-[21px] pr-0 pt-0 relative w-full">
          <Icon55 />
          <Icon56 />
          <Text35 />
        </div>
      </div>
    </div>
  );
}

function App39() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="App">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[516.74px] text-[#99a1af] text-[14px] text-center text-nowrap top-[20.14px] translate-x-[-50%]">
        <p className="leading-[21px] whitespace-pre">White label customization options will be available here.</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-[#1e2939] content-stretch flex flex-col h-[594.857px] items-start left-[1033.43px] top-0 w-[1033.43px]" data-name="Container" style={{ gap: "1.14441e-05px" }}>
      <App38 />
      <App39 />
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-[#1e2939] h-[594.857px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container23 />
      <Container24 />
      <Container25 />
      <Container26 />
      <Container27 />
      <Container28 />
      <Container29 />
      <Container30 />
      <Container31 />
      <Container32 />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Icon57() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_410_481)" id="Icon">
          <path d="M10.5 5.25V10.5L14 12.25" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p16460300} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_410_481">
            <rect fill="white" height="21" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-[119.973px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[24.5px] items-start relative w-[119.973px]">
        <div className="font-['Arimo:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[17.5px] text-gray-100 text-nowrap">
          <p className="leading-[24.5px] whitespace-pre">Opening Times</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex gap-[10.5px] h-[24.5px] items-center left-[21px] top-[21px] w-[991.429px]" data-name="Container">
      <Icon57 />
      <Heading3 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
        <p className="leading-[21px] whitespace-pre">Business Hours</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[#99a1af] text-[12.25px] text-nowrap top-[-1.43px]">
        <p className="leading-[17.5px] whitespace-pre">Not configured</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[42px] items-start left-[21px] top-[66.5px] w-[991.429px]" data-name="Container">
      <Heading4 />
      <Paragraph />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[22.75px] left-[21px] top-[129.5px] w-[991.429px]" data-name="Paragraph">
      <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-[496.17px] text-[#99a1af] text-[14px] text-center text-nowrap top-[-1.29px] translate-x-[-50%]">
        <p className="leading-[22.75px] whitespace-pre">{`Set your operating hours to guide the AI on your store's availability`}</p>
      </div>
    </div>
  );
}

function Icon58() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pc012c00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text36() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Configure Hours</p>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#364153] h-[35px] relative rounded-[8.75px] shrink-0 w-[153.795px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[35px] items-center px-[14px] py-0 relative w-[153.795px]">
        <Icon58 />
        <Text36 />
      </div>
    </div>
  );
}

function Icon59() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.8333H12.25" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text37() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <div className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[14px] text-gray-100 text-nowrap top-[-0.86px]">
          <p className="leading-[21px] whitespace-pre">Holiday Days</p>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#364153] h-[35px] relative rounded-[8.75px] shrink-0 w-[132.188px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[35px] items-center px-[14px] py-0 relative w-[132.188px]">
        <Icon59 />
        <Text37 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex gap-[10.5px] h-[35px] items-start justify-center left-[21px] top-[180.25px] w-[991.429px]" data-name="Container">
      <Button5 />
      <Button6 />
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-[#1e2939] h-[236.25px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.571px_0px_0px] border-black border-solid inset-0 pointer-events-none" />
      <Container36 />
      <Container37 />
      <Paragraph1 />
      <Container38 />
    </div>
  );
}

function App40() {
  return (
    <div className="bg-[#1e2939] content-stretch flex flex-col h-[1063.25px] items-start overflow-clip relative shrink-0 w-full" data-name="App">
      <Container6 />
      <Container35 />
      <Container39 />
    </div>
  );
}

function Ec() {
  return (
    <div className="absolute bg-[#101828] box-border content-stretch flex flex-col h-[1063.25px] items-start left-0 pl-[70px] pr-0 py-0 top-0 w-[1103.43px]" data-name="ec">
      <App40 />
    </div>
  );
}

function ProtectedImg4() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="ProtectedImg2">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg4} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[21px]" />
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[#00c950] relative rounded-[8.75px] shadow-[0px_0px_0px_2px_#7bf1a8,0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <ProtectedImg4 />
      </div>
    </div>
  );
}

function Icon60() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_410_436)" id="Icon">
          <path d={svgPaths.p16460300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p2ed01700} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M1.75 10.5H19.25" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_410_436">
            <rect fill="white" height="21" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-[#2b7fff] relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon60 />
      </div>
    </div>
  );
}

function ProtectedImg5() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="ProtectedImg2">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg5} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[21px]" />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <ProtectedImg5 />
      </div>
    </div>
  );
}

function Icon61() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="Icon">
          <path d={svgPaths.p286e5f60} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Container43() {
  return (
    <div className="bg-[#155dfc] relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon61 />
      </div>
    </div>
  );
}

function Icon62() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="Icon">
          <path d={svgPaths.p15ec2a0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p33625bf0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-[#51a2ff] relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon62 />
      </div>
    </div>
  );
}

function Icon63() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="Icon">
          <path d="M4.375 10.5H16.625" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M10.5 4.375V16.625" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8.75px] shrink-0 w-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[42px]">
        <Icon63 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] h-[322px] items-center left-[13.71px] top-[129.71px] w-[42px]" data-name="Container">
      <Container40 />
      <Container41 />
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
    </div>
  );
}

function Icon64() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="Icon">
          <path d={svgPaths.p3d55d780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M15.75 14.875V7.875" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M11.375 14.875V4.375" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M7 14.875V12.25" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[13.71px] rounded-[8.75px] size-[42px] top-[539.43px]" data-name="Container">
      <Icon64 />
    </div>
  );
}

function ProtectedImg() {
  return (
    <div className="relative shrink-0 size-[42px]" data-name="ProtectedImg">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[42px]" />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#101828] box-border content-stretch flex items-center justify-center left-0 p-[0.571px] rounded-[1.9174e+07px] size-[56px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[1.9174e+07px]" />
      <ProtectedImg />
    </div>
  );
}

function Text38() {
  return (
    <div className="absolute h-[10px] left-[7px] top-[1.75px] w-[32.75px]" data-name="Text">
      <div className="absolute capitalize font-['Arimo:Regular',_sans-serif] font-normal leading-[0] left-0 text-[8px] text-nowrap text-white top-[-1.57px]">
        <p className="leading-[10px] whitespace-pre">premium</p>
      </div>
    </div>
  );
}

function TierIndicator() {
  return (
    <div className="bg-[#fe9a00] h-[13.5px] relative rounded-[1.9174e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="TierIndicator">
      <Text38 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[21px] items-start left-[4.63px] pb-0 pt-[6.25px] px-0 top-[42px] w-[46.75px]" data-name="Button">
      <TierIndicator />
    </div>
  );
}

function SidebarLogoWithTier() {
  return (
    <div className="absolute left-[6.71px] size-[56px] top-[14px]" data-name="SidebarLogoWithTier">
      <Button7 />
      <Button8 />
    </div>
  );
}

function App41() {
  return (
    <div className="absolute bg-neutral-950 h-[595.429px] left-0 top-0 w-[70px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0px_0.571px_0px_0px] border-neutral-800 border-solid inset-0 pointer-events-none" />
      <Container46 />
      <Container47 />
      <SidebarLogoWithTier />
    </div>
  );
}

function AcesAiWebApp() {
  return (
    <div className="absolute bg-neutral-950 h-[1063px] left-0 top-[-4px] w-[1103px]" data-name="Aces AI Web App">
      <Ec />
      <App41 />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white relative size-full">
      <AcesAiWebApp />
    </div>
  );
}
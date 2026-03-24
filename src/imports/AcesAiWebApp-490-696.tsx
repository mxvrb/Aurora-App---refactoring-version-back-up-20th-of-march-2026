import svgPaths from "./svg-n6h5ncjo3y";
import imgImageProfile from "figma:asset/cd8fb78bbdf449467265bf24ba5e7431f5ec4c88.png";
import imgProtectedImg2 from "figma:asset/6e1f7ff7a0d2aa0a313a90da33aa60053d91ea17.png";
import imgProtectedImg3 from "figma:asset/a292b19e84a1f879f651078f73cedfa89b695975.png";
import imgProtectedImg from "figma:asset/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png";

function ImageProfile() {
  return (
    <div className="absolute left-[-1.1px] size-[72.2px] top-[-1.1px]" data-name="Image (Profile)">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageProfile} />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[48.429px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[13.5px] relative w-[48.429px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[13.5px] left-[24.5px] not-italic text-[9px] text-center text-nowrap text-white top-[-1.43px] tracking-[0.225px] translate-x-[-50%] whitespace-pre">View Image</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-black content-stretch flex items-center justify-center left-0 opacity-0 rounded-[14px] size-[70px] top-0" data-name="Container">
      <Text />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#364153] left-0 overflow-clip rounded-[14px] size-[70px] top-0" data-name="Container">
      <ImageProfile />
      <Container />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g clipPath="url(#clip0_490_726)" id="Icon">
          <path d="M5.6875 9.1875H9.1875" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
          <path d={svgPaths.p14b34780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
        </g>
        <defs>
          <clipPath id="clip0_490_726">
            <rect fill="white" height="10.5" width="10.5" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#6a7282] box-border content-stretch flex items-center justify-center left-[50.75px] rounded-[1.9174e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[21px] top-[50.75px]" data-name="Button">
      <Icon />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute left-[259px] size-[70px] top-0" data-name="Container">
      <Container1 />
      <Button />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24.5px] left-[294.35px] not-italic text-[15.75px] text-center text-neutral-50 text-nowrap top-[-2.86px] translate-x-[-50%] whitespace-pre">Contact Details</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[102.83px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[102.83px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#a1a1a1] text-[14px] text-nowrap top-[-0.86px] whitespace-pre">Company Name:</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[45.357px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[45.357px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-0.86px] whitespace-pre">Aces AI</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="[text-underline-position:from-font] basis-0 decoration-solid font-['Arial:Regular',_sans-serif] grow leading-[17.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#155dfc] text-[12.25px] underline">edit</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[21.509px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[21px] items-start pb-0 pt-[2.857px] px-0 relative w-[21.509px]">
        <Text3 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[73.866px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[21px] items-center relative w-[73.866px]">
        <Text2 />
        <Button1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[10.5px] h-[21px] items-center justify-center relative w-full">
          <Text1 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[58.982px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[58.982px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#a1a1a1] text-[14px] text-nowrap top-[-0.86px] whitespace-pre">Category:</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[21px] relative shrink-0 w-[123.946px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[123.946px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-0.86px] whitespace-pre">AI consultancy firms</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="[text-underline-position:from-font] basis-0 decoration-solid font-['Arial:Regular',_sans-serif] grow leading-[17.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#155dfc] text-[12.25px] underline">edit</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[21.509px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[21px] items-start pb-0 pt-[2.857px] px-0 relative w-[21.509px]">
        <Text6 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[21px] relative shrink-0 w-[152.455px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[21px] items-center relative w-[152.455px]">
        <Text5 />
        <Button2 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10.5px] h-[21px] items-center justify-center pl-0 pr-[0.009px] py-0 relative w-full">
          <Text4 />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[21px] relative shrink-0 w-[36.08px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[36.08px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#a1a1a1] text-[14px] text-nowrap top-[-0.86px] whitespace-pre">Email:</p>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-0.86px] whitespace-pre">max.verbeek@acesai.me</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-0 relative shrink-0 w-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-0 w-[20px]" />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[21px] relative shrink-0 w-[177.527px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[21px] items-center relative w-[177.527px]">
        <Text8 />
        <Container7 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[10.5px] h-[21px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Text7 />
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col h-[63px] items-start relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container6 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[21px] h-[108.5px] items-start left-0 top-[112px] w-[588px]" data-name="Container">
      <Heading3 />
      <Container10 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[24.5px] left-0 top-0 w-[588px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24.5px] left-[294px] not-italic text-[15.75px] text-center text-neutral-50 text-nowrap top-[-2.86px] translate-x-[-50%] whitespace-pre">Tier</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2218c380} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.91667 12.25H11.0833" id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[21px] left-[21px] top-0 w-[115.759px]" data-name="Text">
      <p className="[text-underline-position:from-font] absolute decoration-solid font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#155dfc] text-[14px] text-nowrap top-[-0.86px] underline whitespace-pre">Upgrade your plan</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[143.76px] size-[10.5px] top-[5.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Icon">
          <path d="M6.5625 1.3125H9.1875V3.9375" id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
          <path d="M4.375 6.125L9.1875 1.3125" id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
          <path d={svgPaths.p35b87a0} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[21px] left-[216.87px] top-[38.5px] w-[154.259px]" data-name="Button">
      <Icon1 />
      <Text9 />
      <Icon2 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#ffc9c9] h-[24.5px] left-[167.57px] opacity-50 rounded-[1.9174e+07px] top-0 w-[48.071px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[17.5px] left-[10.5px] not-italic text-[#c10007] text-[12.25px] text-nowrap top-[2.07px] whitespace-pre">Basic</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#e9d4ff] h-[24.5px] left-[222.64px] opacity-50 rounded-[1.9174e+07px] top-0 w-[39.295px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[17.5px] left-[10.5px] not-italic text-[#8200db] text-[12.25px] text-nowrap top-[2.07px] whitespace-pre">Pro</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#fe9a00] h-[24.5px] left-[268.94px] rounded-[1.9174e+07px] top-0 w-[69.518px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[17.5px] left-[10.5px] not-italic text-[12.25px] text-nowrap text-white top-[2.07px] whitespace-pre">Premium</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#bedbff] h-[24.5px] left-[345.45px] opacity-50 rounded-[1.9174e+07px] top-0 w-[74.964px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[17.5px] left-[10.5px] not-italic text-[#1447e6] text-[12.25px] text-nowrap top-[2.07px] whitespace-pre">Enterprise</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[24.5px] left-0 top-[75px] w-[588px]" data-name="Container">
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[99.5px] left-0 top-[248.5px] w-[588px]" data-name="Container">
      <Heading4 />
      <Button3 />
      <Container12 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[24.5px] left-0 top-0 w-[588px]" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24.5px] left-[294.34px] not-italic text-[15.75px] text-center text-neutral-50 text-nowrap top-[-2.86px] translate-x-[-50%] whitespace-pre">Instructions Database</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[21px] left-[191.87px] top-[38.5px] w-[204.259px]" data-name="Button">
      <p className="[text-underline-position:from-font] absolute decoration-solid font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#155dfc] text-[14px] text-nowrap top-[-0.86px] underline whitespace-pre">acesai.me/instructions-database</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[59.5px] left-0 top-[376px] w-[588px]" data-name="Container">
      <Heading5 />
      <Button8 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24.5px] left-[294.04px] not-italic text-[15.75px] text-center text-neutral-50 text-nowrap top-[-2.86px] translate-x-[-50%] whitespace-pre">Get Help</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[21px] left-[231.5px] top-0 w-[124.991px]" data-name="Button">
      <p className="[text-underline-position:from-font] absolute decoration-solid font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#155dfc] text-[14px] text-nowrap top-[-0.86px] underline whitespace-pre">support@acesai.me</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[21px] left-[243.73px] top-[28px] w-[100.527px]" data-name="Button">
      <p className="[text-underline-position:from-font] absolute decoration-solid font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[#155dfc] text-[14px] text-nowrap top-[-0.86px] underline whitespace-pre">+971563729686</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[49px] relative shrink-0 w-full" data-name="Container">
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] h-[87.5px] items-start left-0 top-[463.5px] w-[588px]" data-name="Container">
      <Heading6 />
      <Container15 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[rgba(38,38,38,0.3)] h-[31.5px] left-[249.99px] rounded-[6.75px] top-[579px] w-[88.018px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.571px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[17.5px] left-[21.57px] not-italic text-[12.25px] text-neutral-50 text-nowrap top-[5.57px] whitespace-pre">Log Out</p>
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-gray-950 h-[610.5px] left-[318.14px] top-[28px] w-[588px]" data-name="App">
      <Container2 />
      <Container11 />
      <Container13 />
      <Container14 />
      <Container16 />
      <Button11 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p17aa6ec0} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[21px] relative shrink-0 w-[38.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[38.5px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-0 not-italic text-[14px] text-neutral-50 text-nowrap top-[-0.86px] whitespace-pre">Home</p>
      </div>
    </div>
  );
}

function App1() {
  return (
    <div className="absolute bg-neutral-950 box-border content-stretch flex gap-[7px] h-[36.143px] items-center left-[80px] pl-[11.071px] pr-[0.571px] py-[0.571px] rounded-[8.75px] top-[19px] w-[81.643px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.571px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Icon3 />
      <Text10 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.paec2500} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 1.16667V2.33333" id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 11.6667V12.8333" id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p605dd00} id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p9000440} id="Vector_5" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.16667 7H2.33333" id="Vector_6" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.6667 7H12.8333" id="Vector_7" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1ce72f80} id="Vector_8" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pe9da980} id="Vector_9" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="bg-neutral-900 relative rounded-[1.9174e+07px] shrink-0 size-[14px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[14px]" />
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-neutral-50 h-[16.098px] relative rounded-[1.9174e+07px] shrink-0 w-[28px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[0.571px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.9174e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16.098px] items-center pl-[12.571px] pr-[0.571px] py-[0.571px] relative w-[28px]">
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3af23300} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function App2() {
  return (
    <div className="absolute bg-neutral-950 box-border content-stretch flex gap-[7px] h-[31.241px] items-center left-[1038.14px] pl-[11.071px] pr-[0.571px] py-[0.571px] rounded-[8.75px] top-[24px] w-[92.143px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0.571px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Icon4 />
      <PrimitiveButton />
      <Icon5 />
    </div>
  );
}

function ProtectedImg2() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="ProtectedImg2">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg2} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[21px]" />
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#00c950] relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <ProtectedImg2 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_481_2332)" id="Icon">
          <path d={svgPaths.p16460300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p2ed01700} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M1.75 10.5H19.25" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_481_2332">
            <rect fill="white" height="21" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[#2b7fff] relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon6 />
      </div>
    </div>
  );
}

function ProtectedImg3() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="ProtectedImg2">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg3} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[21px]" />
    </div>
  );
}

function Container19() {
  return (
    <div className="relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <ProtectedImg3 />
      </div>
    </div>
  );
}

function Icon7() {
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

function Container20() {
  return (
    <div className="bg-[#155dfc] relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon7 />
      </div>
    </div>
  );
}

function Icon8() {
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

function Container21() {
  return (
    <div className="bg-[#51a2ff] relative rounded-[8.75px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon8 />
      </div>
    </div>
  );
}

function Icon9() {
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

function Container22() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8.75px] shrink-0 w-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[42px]">
        <Icon9 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] h-[322px] items-center left-[13.71px] top-[135.71px] w-[42px]" data-name="Container">
      <Container17 />
      <Container18 />
      <Container19 />
      <Container20 />
      <Container21 />
      <Container22 />
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

function Button12() {
  return (
    <div className="absolute bg-[#101828] box-border content-stretch flex items-center justify-center left-0 p-[0.571px] rounded-[1.9174e+07px] size-[56px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#1e2939] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[1.9174e+07px]" />
      <ProtectedImg />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[10px] left-[7px] top-[1.75px] w-[32.75px]" data-name="Text">
      <p className="absolute capitalize font-['Arial:Regular',_sans-serif] leading-[10px] left-0 not-italic text-[8px] text-nowrap text-white top-[-1.57px] whitespace-pre">premium</p>
    </div>
  );
}

function TierIndicator() {
  return (
    <div className="bg-[#fe9a00] h-[13.5px] relative rounded-[1.9174e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="TierIndicator">
      <Text11 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[21px] items-start left-[4.63px] pb-0 pt-[6.25px] px-0 top-[42px] w-[46.75px]" data-name="Button">
      <TierIndicator />
    </div>
  );
}

function SidebarLogoWithTier() {
  return (
    <div className="absolute left-[6.71px] size-[56px] top-[14px]" data-name="SidebarLogoWithTier">
      <Button12 />
      <Button13 />
    </div>
  );
}

function Icon10() {
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

function Container24() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[13.71px] rounded-[8.75px] size-[42px] top-[551.43px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function App3() {
  return (
    <div className="absolute bg-neutral-950 h-[607.429px] left-0 top-0 w-[70px]" data-name="App">
      <div aria-hidden="true" className="absolute border-[0px_0.571px_0px_0px] border-neutral-800 border-solid inset-0 pointer-events-none" />
      <Container23 />
      <SidebarLogoWithTier />
      <Container24 />
    </div>
  );
}

export default function AcesAiWebApp() {
  return (
    <div className="bg-neutral-950 relative size-full" data-name="Aces AI Web App">
      <App />
      <App1 />
      <App2 />
      <App3 />
    </div>
  );
}
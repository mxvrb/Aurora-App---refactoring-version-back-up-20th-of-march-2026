import imgProtectedImg2 from "figma:asset/52616a432da32590de2bcc9eea1aab39206d78ea.png";

function ProtectedImg2() {
  return (
    <div className="h-[28px] relative shrink-0 w-[32px]" data-name="ProtectedImg2">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProtectedImg2} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] w-[32px]" />
    </div>
  );
}

function App() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="App">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[21px] left-[-3.37px] not-italic text-[14px] text-gray-100 text-nowrap top-[0.43px] whitespace-pre">Chat with AI</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[21px] relative shrink-0 w-[102.348px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[21px] items-center relative w-[102.348px]">
        <ProtectedImg2 />
        <App />
      </div>
    </div>
  );
}

export default function App1() {
  return (
    <div className="bg-[#364153] relative rounded-[8.75px] size-full" data-name="App">
      <div aria-hidden="true" className="absolute border-[#4a5565] border-[0.571px] border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center pl-[14.571px] pr-[0.571px] py-[0.571px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}
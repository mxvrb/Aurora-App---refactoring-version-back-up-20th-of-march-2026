import imgHelpArrow from "figma:asset/094ce126a4f8b5e2664c17ed28bf24370a5161c7.png";

function HelpArrow() {
  return (
    <div className="absolute h-[90px] left-[186px] top-[39px] w-[120px]" data-name="HelpArrow">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgHelpArrow} />
    </div>
  );
}

export default function AcesAiWebApp() {
  return (
    <div className="bg-white relative size-full" data-name="Aces AI Web App">
      <HelpArrow />
    </div>
  );
}
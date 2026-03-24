import svgPaths from "../imports/svg-ygymjih4cm";

function Icon({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="relative shrink-0 size-[5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
        <g clipPath="url(#clip0_620_130)" id="Icon">
          <path d={svgPaths.p18a65700} id="Vector" stroke={isDarkMode ? "white" : "#2b374a"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33395" />
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

function Container({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div 
      className="absolute content-stretch flex flex-col h-[5.491px] items-start w-[4.321px]" 
      style={{ left: '11.7px', top: '4.3px' }}
      data-name="Container"
    >
      <Icon isDarkMode={isDarkMode} />
    </div>
  );
}

function Icon1({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="h-[6.42px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[14.29%_12.11%_24.03%_7.14%]" data-name="Vector">
        <div className="absolute inset-[-17.78%_-6.48%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 6">
            <path d={svgPaths.p24b5bc00} id="Vector" stroke={isDarkMode ? "white" : "#2b374a"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.40815" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container1({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div 
      className="absolute content-stretch flex flex-col h-[6.42px] items-start w-[13.455px]" 
      style={{ left: '1.83px', top: '5.71px' }}
      data-name="Container"
    >
      <Icon1 isDarkMode={isDarkMode} />
    </div>
  );
}

function Icon2({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="relative shrink-0 size-[5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
        <g id="Icon">
          <path d={svgPaths.p9ff580} id="Vector" stroke={isDarkMode ? "white" : "#2b374a"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.32497" />
        </g>
      </svg>
    </div>
  );
}

function Container2({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div 
      className="absolute content-stretch flex flex-col items-start size-[5px]" 
      style={{ left: '4.5px', top: '11px' }}
      data-name="Container"
    >
      <Icon2 isDarkMode={isDarkMode} />
    </div>
  );
}

function Icon3({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="h-[5.464px] relative shrink-0 w-[12.536px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 6">
        <g id="Icon">
          <path d={svgPaths.p36f60cc0} id="Vector" stroke={isDarkMode ? "white" : "#2b374a"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.40557" />
        </g>
      </svg>
    </div>
  );
}

function Container3({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div 
      className="absolute content-stretch flex flex-col h-[5.464px] items-start" 
      style={{ left: '6.4px', top: '9.53px', width: '12.536px' }}
      data-name="Container"
    >
      <Icon3 isDarkMode={isDarkMode} />
    </div>
  );
}

function RepeatIcon({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div 
      className="absolute size-[21px]" 
      style={{ left: '9.32px', top: '9.32px', transform: 'translate3d(0, 0, 0)' }}
      data-name="RepeatIcon"
    >
      <Container isDarkMode={isDarkMode} />
      <Container1 isDarkMode={isDarkMode} />
      <Container2 isDarkMode={isDarkMode} />
      <Container3 isDarkMode={isDarkMode} />
    </div>
  );
}

export default function SwitchViewButton({ onClick, isDarkMode }: { onClick: () => void; isDarkMode: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-[8.75px] w-[40px] h-[40px] transition-colors transform-gpu z-[9999] ${
        isDarkMode 
          ? 'bg-[#2b374a] hover:bg-[#364153]' 
          : 'bg-white hover:bg-gray-50'
      }`}
      style={{ 
        backfaceVisibility: 'hidden', 
        willChange: 'transform',
        boxShadow: isDarkMode 
          ? '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)'
          : '0px 1px 3px 0px rgba(0,0,0,0.15), 0px 1px 2px -1px rgba(0,0,0,0.1), inset 0 0 0 0.571px #e5e7eb'
      }}
      data-name="SwitchViewButton"
      title="Switch Views"
    >
      <RepeatIcon isDarkMode={isDarkMode} />
    </button>
  );
}

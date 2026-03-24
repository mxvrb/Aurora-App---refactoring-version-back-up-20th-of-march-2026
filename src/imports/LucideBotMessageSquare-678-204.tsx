import svgPaths from "./svg-4b3pap1q7p";
import slashedPaths from "./svg-y2yawrybl6";

export default function LucideBotMessageSquare({ isOpen = false }: { isOpen?: boolean }) {
  return (
    <div className="relative size-full" data-name="lucide/bot-message-square">
      <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 24 24" style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.15s' }}>
        <g id="lucide/bot-message-square">
          <path d={svgPaths.p13535a80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
      <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 24 24" style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.15s', transform: 'translate(0.8px, -0.8px)' }}>
        <g id="lucide/bot-message-square-slashed">
          <path d={slashedPaths.pbee5e00} id="Vector-slashed" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
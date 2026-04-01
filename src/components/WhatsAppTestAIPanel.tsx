import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, BotMessageSquare, FlaskConical, Send, X, Minus, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RobotExpandedOpt from '../imports/RobotExpandedOpt22-3827-766';

interface WhatsAppTestAIPanelProps {
  isTestAIPanelOpen: boolean;
  setIsTestAIPanelOpen: (open: boolean) => void;
  testAIPanelWidth: number;
  setTestAIPanelWidth: (width: number) => void;
  isResizingTestAI: boolean;
  setIsResizingTestAI: (resizing: boolean) => void;
  testAIPanelTransitionDuration: number;
  setTestAIPanelTransitionDuration: (duration: number) => void;
  isDarkMode: boolean;
  MIN_TEST_AI_WIDTH: number;
  MAX_TEST_AI_WIDTH: number;
}

// ─── Direct-DOM drag — mutates container.style.transform, zero React re-renders ─
function useDrag(containerRef: React.RefObject<HTMLDivElement | null>) {
  const offset   = useRef({ x: 0, y: 0 });
  const active   = useRef(false);
  const didDrag  = useRef(false);
  const ds       = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const startDrag = useCallback((e: React.MouseEvent) => {
    active.current  = true;
    didDrag.current = false;
    ds.current = { mx: e.clientX, my: e.clientY, px: offset.current.x, py: offset.current.y };
    e.preventDefault();
  }, []);

  // Nudge the container by `dy` pixels downward (positive = down)
  const nudge = useCallback((dy: number) => {
    offset.current.y += dy;
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${offset.current.x}px,${offset.current.y}px)`;
    }
  }, [containerRef]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!active.current) return;
      const dx = e.clientX - ds.current.mx;
      const dy = e.clientY - ds.current.my;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag.current = true;
      offset.current = { x: ds.current.px + dx, y: ds.current.py + dy };
      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${offset.current.x}px,${offset.current.y}px)`;
      }
    };
    const onUp = () => { active.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [containerRef]);

  const resetDrag = useCallback(() => {
    offset.current = { x: 0, y: 0 };
    if (containerRef.current) {
      containerRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, [containerRef]);

  return { startDrag, didDrag, nudge, resetDrag };
}

export function WhatsAppTestAIPanel({
  isTestAIPanelOpen,
  setIsTestAIPanelOpen,
  isDarkMode,
}: WhatsAppTestAIPanelProps) {
  const [isHovered,   setIsHovered]   = useState(false);
  const [isMinimizedToCorner, setIsMinimizedToCorner] = useState(false);
  const [messages,    setMessages]    = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [inputValue,  setInputValue]  = useState('');
  const [isThinking,  setIsThinking]  = useState(false);
  const [panelSize,   setPanelSize]   = useState({ width: 390, height: 620 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MIN_W = 320;
  const MAX_W = 600;
  const MIN_H = 400;
  const MAX_H = 850;

  // Single container that is ALWAYS mounted — drag moves this, children ride along
  const containerRef = useRef<HTMLDivElement>(null);
  const { startDrag, didDrag, nudge, resetDrag } = useDrag(containerRef);

  // Resize handler
  const startResize = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = panelSize.width;
    const startH = panelSize.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newW = startW;
      let newH = startH;

      if (direction.includes('right')) {
        newW = startW + (moveEvent.clientX - startX);
      } else if (direction.includes('left')) {
        newW = startW - (moveEvent.clientX - startX);
      }

      if (direction.includes('bottom')) {
        newH = startH + (moveEvent.clientY - startY);
      } else if (direction.includes('top')) {
        newH = startH - (moveEvent.clientY - startY);
      }

      setPanelSize({
        width: Math.max(MIN_W, Math.min(MAX_W, newW)),
        height: Math.max(MIN_H, Math.min(MAX_H, newH))
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [panelSize]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleOpen = () => {
    if (didDrag.current) return;

    // ── Clamp so the panel never opens above the viewport ──────────────────
    if (containerRef.current) {
      const rect        = containerRef.current.getBoundingClientRect();
      const PANEL_HEIGHT = panelSize.height;
      const MARGIN       = 16;   // px from top of viewport
      const REM_OFFSET   = 48;   // 3rem in px
      const panelTop = rect.bottom + REM_OFFSET - PANEL_HEIGHT;
      if (panelTop < MARGIN) {
        nudge(MARGIN - panelTop);
      }
    }

    setIsMinimizedToCorner(false);
    setIsTestAIPanelOpen(true);
  };
  const handleClose    = () => { setIsTestAIPanelOpen(false); setIsMinimizedToCorner(false); };
  const handleMinimize = () => { setIsTestAIPanelOpen(false); setIsMinimizedToCorner(true); resetDrag(); };
  const handlePromoteToBall = () => { setIsMinimizedToCorner(false); setIsTestAIPanelOpen(false); resetDrag(); };

  const handleSend = () => {
    if (!inputValue.trim() || isThinking) return;
    const txt = inputValue.trim();
    setMessages(p => [...p, { role: 'user', text: txt }]);
    setInputValue('');
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setMessages(p => [...p, { role: 'ai', text: `Thanks for testing! AI response to: "${txt}"` }]);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Shared glass style ──────────────────────────────────────────────────────
  const glass: React.CSSProperties = {
    background:              isDarkMode ? 'rgba(18,18,24,0.96)' : 'rgba(255,255,255,0.96)',
    backdropFilter:          'blur(40px)',
    WebkitBackdropFilter:    'blur(40px)',
    border:                  isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
    boxShadow:               isDarkMode
      ? '0 30px 70px rgba(0,0,0,0.6), 0 0 80px rgba(37,211,102,0.07)'
      : '0 30px 70px rgba(0,0,0,0.15), 0 0 80px rgba(37,211,102,0.06)',
  };

  // Panel/pill offset: container is at bottom:5rem right:5rem.
  // Panel should appear at bottom:2rem right:2rem → offset = -(5rem-2rem) = -3rem each side.
  const PANEL_OFFSET = 'calc(-3rem)';

  return (
    /*
     * ── Single always-mounted fixed container ──────────────────────────────────
     * This is the ONLY thing we translate. All children (circle, pill, panel)
     * are absolutely positioned inside it and ride along for free — no lag.
     * overflow:visible lets panel extend outside the 200×200 bounds.
    */
    <div
      ref={containerRef}
      style={{
        position:      'fixed',
        bottom:        '5rem',
        right:         '5rem',
        width:         200,
        height:        200,
        zIndex:        9999,
        transform:     'translate(0,0)',   // direct DOM drag updates this
        pointerEvents: 'none',            // container itself doesn't eat clicks
        overflow:      'visible',
        userSelect:    'none',
      }}
    >

      {/* ── Speech bubble — only visible when in ball form ── */}
      <AnimatePresence>
        {!isTestAIPanelOpen && !isMinimizedToCorner && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.88, y: 6 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{    opacity: 0, scale: 0.88, y: 4 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none"
            style={{ position: 'absolute', left: 35, top: 58 }}
          >
            {/* Glow */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 18,
              background: isDarkMode
                ? 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.22) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.28) 0%, transparent 70%)',
              filter: 'blur(10px)', transform: 'scaleY(1.4)', zIndex: 0,
            }} />
            {/* Bubble */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'relative', padding: '9px 20px', borderRadius: 14,
                whiteSpace: 'nowrap', zIndex: 1,
                background: isDarkMode
                  ? 'linear-gradient(163deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0.05) 60%,rgba(52,211,153,0.08) 100%)'
                  : 'linear-gradient(163deg,rgba(255,255,255,0.95) 0%,rgba(255,255,255,0.75) 60%,rgba(209,250,229,0.6) 100%)',
                backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                border: isDarkMode ? '0.5px solid rgba(255,255,255,0.18)' : '0.5px solid rgba(255,255,255,0.9)',
                boxShadow: isDarkMode
                  ? '0 2px 0 rgba(255,255,255,0.08) inset,0 -1px 0 rgba(0,0,0,0.3) inset,0 12px 40px rgba(0,0,0,0.45),0 0 20px rgba(52,211,153,0.12)'
                  : '0 2px 0 rgba(255,255,255,1) inset,0 -1px 0 rgba(0,0,0,0.06) inset,0 12px 40px rgba(0,0,0,0.1),0 0 0 1px rgba(255,255,255,0.6)',
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: 12, right: 12, height: 5, borderRadius: 99,
                background: isDarkMode
                  ? 'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)'
                  : 'linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)',
                filter: 'blur(1px)',
              }} />
              <span style={{
                position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 600, color: isDarkMode ? '#e5e7eb' : '#065f46',
              }}>
                <motion.span
                  animate={{ rotate: [0, 18, -6, 18, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                  style={{ display: 'inline-flex', position: 'relative', width: 18, height: 18 }}
                >
                  <FlaskConical style={{ width: 18, height: 18, color: '#10b981', position: 'relative', zIndex: 10 }} />
                  {[
                    { s: 2.5, l: 9,  b: 2, dur: 1.5, delay: 0 },
                    { s: 2,   l: 12, b: 4, dur: 2.0, delay: 0.55 },
                    { s: 1.5, l: 6,  b: 3, dur: 1.7, delay: 1.0 },
                  ].map((bb, i) => (
                    <motion.span key={i}
                      animate={{ y: [-2, -10], opacity: [1, 0] }}
                      transition={{ duration: bb.dur, repeat: Infinity, ease: 'easeOut', delay: bb.delay, repeatDelay: 0.4 }}
                      style={{ position: 'absolute', borderRadius: '50%', width: bb.s, height: bb.s, left: bb.l, bottom: bb.b, background: '#10b981', zIndex: 20 }}
                    />
                  ))}
                </motion.span>
                Test your AI
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Connector dots — only visible when in ball form ── */}
      <AnimatePresence>
        {!isTestAIPanelOpen && !isMinimizedToCorner && (
          <>
            <motion.div key="dot-lg"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, y: [0,-3,0] }} exit={{ opacity: 0, scale: 0 }}
              transition={{ opacity:{duration:0.22}, scale:{duration:0.22}, y:{duration:2.8,repeat:Infinity,ease:'easeInOut'} }}
              style={{
                position:'absolute', left:146, top:100, width:14, height:14, borderRadius:'50%',
                background: isDarkMode
                  ? 'linear-gradient(135deg,rgba(255,255,255,0.30) 0%,rgba(255,255,255,0.10) 100%)'
                  : 'linear-gradient(135deg,rgba(255,255,255,0.95) 0%,rgba(220,252,231,0.8) 100%)',
                backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.28)' : '1.5px solid rgba(255,255,255,1)',
                boxShadow: isDarkMode
                  ? '0 3px 12px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.25)'
                  : '0 3px 10px rgba(0,0,0,0.13),inset 0 1px 0 rgba(255,255,255,1)',
              }}
            />
            <motion.div key="dot-sm"
              initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1, y:[0,-2,0] }} exit={{ opacity:0, scale:0 }}
              transition={{ opacity:{duration:0.22,delay:0.08}, scale:{duration:0.22,delay:0.08}, y:{duration:2.8,repeat:Infinity,ease:'easeInOut',delay:0.2} }}
              style={{
                position:'absolute', left:137, top:117, width:9, height:9, borderRadius:'50%',
                background: isDarkMode
                  ? 'linear-gradient(135deg,rgba(255,255,255,0.28) 0%,rgba(255,255,255,0.09) 100%)'
                  : 'linear-gradient(135deg,rgba(255,255,255,0.95) 0%,rgba(220,252,231,0.8) 100%)',
                backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.26)' : '1.5px solid rgba(255,255,255,1)',
                boxShadow: isDarkMode
                  ? '0 2px 8px rgba(0,0,0,0.38),inset 0 1px 0 rgba(255,255,255,0.22)'
                  : '0 2px 7px rgba(0,0,0,0.11),inset 0 1px 0 rgba(255,255,255,1)',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          MORPH TARGET — corner circle ↔ draggable ball ↔ full panel
          All share layoutId. Only one is rendered at a time.
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>

        {/* ── CORNER CIRCLE (stuck in corner, small) ── */}
        {isMinimizedToCorner && !isTestAIPanelOpen && (
          <motion.button
            key="corner-circle"
            layoutId="ai-morph"
            onClick={handlePromoteToBall}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ layout: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } }}
            style={{
              position:       'absolute',
              bottom:         'calc(-5rem + 20px)', // Perfect bottom alignment
              right:          'calc(-5rem + 20px)', // Equal gap to right edge as bottom gap
              width:          44,
              height:         44,
              borderRadius:   '50%',
              border:         0,
              outline:        'none',
              cursor:         'pointer',
              pointerEvents:  'auto',
              background:     'linear-gradient(145deg,#25D366 0%,#128C7E 50%,#075E54 100%)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              overflow:       'hidden',
              zIndex:         10000,
            }}
          >
            <div className="w-[28px] h-[28px] relative z-10 flex items-center justify-center" style={{ '--fill-0': 'white' } as React.CSSProperties}>
              <div style={{ width: 12, height: 12, transform: 'scale(2.5)', transformOrigin: 'center' }}>
                <RobotExpandedOpt />
              </div>
            </div>
          </motion.button>
        )}

        {/* ── DRAGGABLE BALL (closed) ── */}
        {!isTestAIPanelOpen && !isMinimizedToCorner && (
          <motion.button
            key="circle"
            layoutId="ai-morph"
            onMouseDown={startDrag}
            onClick={handleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ layout: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } }}
            style={{
              position:       'absolute',
              bottom:         -20,
              left:           40,
              width:          110,
              height:         110,
              borderRadius:   '50%',
              border:         0,
              outline:        'none',
              cursor:         'grab',
              pointerEvents:  'auto',
              background:     'linear-gradient(145deg,#25D366 0%,#128C7E 50%,#075E54 100%)',
              boxShadow:      isHovered
                ? '0 10px 36px rgba(37,211,102,0.55),0 0 60px rgba(37,211,102,0.2)'
                : '0 6px 28px rgba(37,211,102,0.38),0 0 40px rgba(37,211,102,0.12)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              overflow:       'hidden',
            }}
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: 'rgba(37,211,102,0.4)', animationDuration: '2.2s' }} />
            <div className="absolute -inset-[2px] rounded-full opacity-50" style={{
              background: 'linear-gradient(135deg,rgba(37,211,102,0.5),rgba(18,140,126,0.3),rgba(37,211,102,0.5))',
              filter: 'blur(2px)',
            }} />
            <div className="w-[72px] h-[72px] relative z-10 drop-shadow flex items-center justify-center" style={{ '--fill-0': 'white' } as React.CSSProperties}>
              <div style={{ width: 24, height: 24, transform: 'scale(3)', transformOrigin: 'center' }}>
                <RobotExpandedOpt />
              </div>
            </div>
          </motion.button>
        )}

        {/* ── FULL PANEL (open) ── */}
        {isTestAIPanelOpen && (
          <motion.div
            key="full-panel"
            layoutId="ai-morph"
            className="flex flex-col"
            transition={{ layout: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } }}
            style={{
              position:      'absolute',
              bottom:        PANEL_OFFSET,
              right:         PANEL_OFFSET,
              width:         panelSize.width,
              height:        panelSize.height,
              maxHeight:     'calc(100vh - 80px)',
              maxWidth:      'calc(100vw - 32px)',
              borderRadius:  16,
              overflow:      'hidden',
              pointerEvents: 'auto',
              background:    isDarkMode ? '#0b141a' : '#efeae2',
              boxShadow:     isDarkMode ? '0 16px 40px rgba(0,0,0,0.5)' : '0 16px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Edge Resize Handles */}
            <div className="absolute top-0 left-0 w-full h-[6px] cursor-ns-resize z-[60]" onMouseDown={e => startResize(e, 'top')} />
            <div className="absolute bottom-0 left-0 w-full h-[6px] cursor-ns-resize z-[60]" onMouseDown={e => startResize(e, 'bottom')} />
            <div className="absolute top-0 left-0 w-[6px] h-full cursor-ew-resize z-[60]" onMouseDown={e => startResize(e, 'left')} />
            <div className="absolute top-0 right-0 w-[6px] h-full cursor-ew-resize z-[60]" onMouseDown={e => startResize(e, 'right')} />
            
            {/* Corner Resize Handles */}
            <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-[70]" onMouseDown={e => startResize(e, 'top-left')} />
            <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-[70]" onMouseDown={e => startResize(e, 'top-right')} />
            <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-[70]" onMouseDown={e => startResize(e, 'bottom-left')} />
            
            {/* Retro 6-dot Triangle Resize Handle (Bottom Right) */}
            <div 
              className="absolute bottom-1 right-1 w-5 h-5 cursor-nwse-resize z-[80] flex flex-col items-end justify-end gap-[3px] pr-[2px] pb-[2px] opacity-40 hover:opacity-100 transition-opacity"
              onMouseDown={e => startResize(e, 'bottom-right')}
            >
              <div className="flex gap-[3px]">
                <div className="w-[3px] h-[3px] rounded-full bg-gray-500"></div>
              </div>
              <div className="flex gap-[3px]">
                <div className="w-[3px] h-[3px] rounded-full bg-gray-500"></div>
                <div className="w-[3px] h-[3px] rounded-full bg-gray-500"></div>
              </div>
              <div className="flex gap-[3px]">
                <div className="w-[3px] h-[3px] rounded-full bg-gray-500"></div>
                <div className="w-[3px] h-[3px] rounded-full bg-gray-500"></div>
                <div className="w-[3px] h-[3px] rounded-full bg-gray-500"></div>
              </div>
            </div>

            {/* Header — drag the panel from here */}
            <div
              onMouseDown={startDrag}
              className="flex items-center justify-between px-4 py-2 flex-shrink-0"
              style={{
                background:   isDarkMode ? '#202c33' : '#008069',
                cursor:       'grab',
              }}
            >
              {/* Avatar + title (pointer-events:none so text doesn't fight drag) */}
              <div className="flex items-center gap-3 py-1" style={{ pointerEvents: 'none' }}>
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center overflow-hidden" style={{ background: '#10b981', '--fill-0': 'white' } as React.CSSProperties}>
                  <div style={{ width: 18, height: 18, transform: 'scale(1.5) translateY(1.5px)', transformOrigin: 'center' }}>
                    <RobotExpandedOpt />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium text-[16px] leading-[21px]">Test your AI</span>
                  <span className="text-white/80 text-[13px] leading-[20px] h-[20px] flex items-center">
                    {isThinking ? (
                      <span className="flex items-center">
                        Thinking
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 1], delay: 0 }}
                        >.</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 1], delay: 0.2 }}
                        >.</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 1], delay: 0.4 }}
                        >.</motion.span>
                      </span>
                    ) : 'Start Typing'}
                  </span>
                </div>
              </div>

              {/* Buttons — stopPropagation so clicks don't trigger drag */}
              <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
                <button onClick={handleMinimize}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer">
                  <Minus className="w-[20px] h-[20px]" />
                </button>
                <button onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer">
                  <X className="w-[20px] h-[20px]" />
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div
              className="flex-1 overflow-y-auto px-[4%] py-4 space-y-1 relative scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                cursor: 'default',
                userSelect: 'text',
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              <style jsx>{`
                &::-webkit-scrollbar { width: 4px; height: 4px; }
                &::-webkit-scrollbar-track { background: transparent; }
                &::-webkit-scrollbar-thumb { 
                  background: rgba(166,168,170,0.4); 
                  border-radius: 2px; 
                  transition: background 0.2s;
                }
                &:hover::-webkit-scrollbar-thumb { background: rgba(166,168,170,0.6); }
              `}</style>
              {/* Authentic WhatsApp Doodles pattern overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: isDarkMode 
                  ? 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")'
                  : 'url("https://web.whatsapp.com/img/bg-chat-tile-light_686b98c9fdffef3f63127759e2057750.png")',
                backgroundSize: '412.5px 749.25px',
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center',
                opacity: isDarkMode ? 0.05 : 0.08,
              }} />
              
              <div className="relative z-10 flex flex-col h-full">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-2 space-y-4 flex-1">
                    <div className="text-[12.5px] px-4 py-2 rounded-md text-center max-w-[90%] shadow-sm leading-[18px]"
                      style={{
                        background: isDarkMode ? '#182229' : '#FFEECD',
                        color: isDarkMode ? '#8696A0' : '#54656F',
                      }}>
                      <span className="mr-1 inline-block translate-y-[1px]">🔒</span> Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-[2px]">
                    {messages.map((msg, i) => {
                      const isUser = msg.role === 'user';
                      const isFirstInSequence = i === 0 || messages[i - 1].role !== msg.role;
                      
                      return (
                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} relative group`}>
                          <div className="relative max-w-[85%] min-w-[70px] px-[9px] pt-[6px] pb-[4px] text-[14.2px] leading-[19px] shadow-[0_1px_0.5px_rgba(11,20,26,.13)]"
                            style={{
                              borderRadius: isFirstInSequence 
                                ? (isUser ? '8px 0 8px 8px' : '0 8px 8px 8px')
                                : '8px',
                              background: isUser
                                ? (isDarkMode ? '#005c4b' : '#d9fdd3')
                                : (isDarkMode ? '#202c33' : '#ffffff'),
                              color: isDarkMode ? '#e9edef' : '#111b21',
                              marginTop: isFirstInSequence ? '8px' : '0',
                            }}>
                            {/* Authentic tail (only on first message of sequence) */}
                            {isFirstInSequence && (
                              <svg 
                                viewBox="0 0 8 13" 
                                width="8" 
                                height="13" 
                                className="absolute top-0"
                                style={{
                                  [isUser ? 'right' : 'left']: '-8px',
                                  color: isUser 
                                    ? (isDarkMode ? '#005c4b' : '#d9fdd3') 
                                    : (isDarkMode ? '#202c33' : '#ffffff'),
                                }}
                              >
                                {isUser ? (
                                  <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"/>
                                ) : (
                                  <path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"/>
                                )}
                              </svg>
                            )}
                            
                            <div className="flex flex-wrap items-end justify-end">
                              <span className="flex-1 break-words pb-1 pr-2">
                                {msg.text}
                              </span>
                                
                              <div className="flex items-center gap-1 text-[11px] leading-[15px] select-none h-[15px] mb-[2px] ml-auto shrink-0"
                                style={{ 
                                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#667781' 
                                }}>
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {isUser && (
                                  <div className="flex -space-x-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#53bdeb">
<path d="M0.410034 13.41L6.00003 19L7.41003 17.58L1.83003 12L0.410034 13.41ZM22.24 5.57996L11.66 16.17L7.50003 12L6.07003 13.41L11.66 19L23.66 6.99996L22.24 5.57996ZM18 6.99996L16.59 5.57996L10.24 11.93L11.66 13.34L18 6.99996Z" />
</svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {isThinking && (
                      <div className="flex justify-start">
                        <div className="relative w-auto min-w-0 px-3 py-1.5 text-xs leading-tight shadow-[0_1px_0.5px_rgba(11,20,26,.13)] rounded-[0_8px_8px_8px] bg-white dark:bg-[#202c33] mt-[6px]">
                          <svg viewBox="0 0 8 13" width="6.5" height="11" className="absolute top-0 left-[-6.5px] text-white dark:text-[#202c33]">
                            <path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"/>
                          </svg>
                          <div className="flex items-center gap-0.5 py-0.5 px-0.5">
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.25 h-1.25 rounded-full bg-gray-400" />
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.25 h-1.25 rounded-full bg-gray-400" />
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.25 h-1.25 rounded-full bg-gray-400" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Input area & Floating quick replies */}
            <div className="flex flex-col flex-shrink-0 relative z-20">
              {messages.length === 0 && (
                <div 
                  className={`flex gap-2 overflow-x-auto px-4 pb-2 pt-1 scrollbar-hide snap-x snap-mandatory ${panelSize.width > 500 ? 'justify-center' : 'justify-start'}`}
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                  }}
                  onWheel={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const container = e.currentTarget as HTMLElement;
                    const scrollLeft = container.scrollLeft + (e.deltaX || -e.deltaY || 0);
                    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar { display: none; }
                    div::-webkit-scrollbar-track { display: none; }
                  `}</style>
                  {['"What are your hours?"', '"How do I book?"', '"Show me services"'].map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => setInputValue(q.replace(/"/g, ''))}
                      className="px-3 py-1.5 text-[13px] rounded-full transition-all cursor-pointer shadow-sm border whitespace-nowrap flex-shrink-0 snap-center"
                      style={{
                        background: isDarkMode ? '#202c33' : '#ffffff',
                        color: isDarkMode ? '#e9edef' : '#111b21',
                        borderColor: isDarkMode ? '#202c33' : '#e5e7eb',
                      }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div
                className="px-4 py-2 flex items-end gap-2"
                style={{
                  background:   isDarkMode ? '#202c33' : '#f0f2f5',
                }}
                onMouseDown={e => e.stopPropagation()}
              >
                <div className="flex-1 flex items-end rounded-[21px] overflow-hidden px-4 py-[9px]"
                  style={{
                    background: isDarkMode ? '#2a3942' : '#ffffff',
                  }}>
                  <textarea
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                    className="w-full max-h-[100px] min-h-[20px] bg-transparent text-[15px] leading-[20px] text-gray-900 dark:text-[#e9edef] placeholder-[#8696a0] focus:outline-none resize-none"
                    rows={1}
                    style={{ cursor: 'text', userSelect: 'text', padding: '0' }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isThinking}
                  className="w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center text-white disabled:opacity-60 transition-all cursor-pointer shadow-sm mb-[4px]"
                  style={{
                    background: '#00a884',
                  }}>
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
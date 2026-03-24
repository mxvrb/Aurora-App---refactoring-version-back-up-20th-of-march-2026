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
function useDrag(containerRef: React.RefObject<HTMLDivElement>) {
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

  return { startDrag, didDrag, nudge };
}

export function WhatsAppTestAIPanel({
  isTestAIPanelOpen,
  setIsTestAIPanelOpen,
  isDarkMode,
}: WhatsAppTestAIPanelProps) {
  const [isHovered,   setIsHovered]   = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages,    setMessages]    = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [inputValue,  setInputValue]  = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Single container that is ALWAYS mounted — drag moves this, children ride along
  const containerRef = useRef<HTMLDivElement>(null);
  const { startDrag, didDrag, nudge } = useDrag(containerRef);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpen = () => {
    if (didDrag.current) return;

    // ── Clamp so the panel never opens above the viewport ──────────────────
    // Panel is 560px tall, anchored at container.bottom + 48px (3rem).
    // Minimum rect.bottom needed = PANEL_HEIGHT + MARGIN - REM_OFFSET
    if (containerRef.current) {
      const rect        = containerRef.current.getBoundingClientRect();
      const PANEL_HEIGHT = 560;
      const MARGIN       = 16;   // px from top of viewport
      const REM_OFFSET   = 48;   // 3rem in px
      // panelTop (from viewport top) = rect.bottom + REM_OFFSET - PANEL_HEIGHT
      const panelTop = rect.bottom + REM_OFFSET - PANEL_HEIGHT;
      if (panelTop < MARGIN) {
        // Push container DOWN so the panel top lands at MARGIN
        nudge(MARGIN - panelTop);
      }
    }

    setIsMinimized(false);
    setIsTestAIPanelOpen(true);
  };
  const handleClose    = () => { setIsTestAIPanelOpen(false); setIsMinimized(false); };
  const handleMinimize = () => setIsMinimized(v => !v);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const txt = inputValue.trim();
    setMessages(p => [...p, { role: 'user', text: txt }]);
    setInputValue('');
    setTimeout(() => {
      setMessages(p => [...p, { role: 'ai', text: `Thanks for testing! AI response to: "${txt}"` }]);
    }, 1200);
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

      {/* ── Speech bubble — always visible when panel is closed ── */}
      <AnimatePresence>
        {!isTestAIPanelOpen && (
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

      {/* ── Connector dots — always visible when panel is closed ── */}
      <AnimatePresence>
        {!isTestAIPanelOpen && (
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
          MORPH TARGET — circle ↔ pill ↔ full panel, all share layoutId
          Only one is rendered at a time; Motion morphs between them.
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>

        {/* ── CIRCLE (closed) ── */}
        {!isTestAIPanelOpen && (
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

        {/* ── MINI PILL (open + minimized) ── */}
        {isTestAIPanelOpen && isMinimized && (
          <motion.div
            key="mini-pill"
            layoutId="ai-morph"
            className="flex items-center gap-2 px-4"
            transition={{ layout: { duration: 0.42, ease: [0.23, 1, 0.32, 1] } }}
            style={{
              position:      'absolute',
              bottom:        PANEL_OFFSET,
              right:         PANEL_OFFSET,
              width:         260,
              height:        52,
              borderRadius:  26,
              cursor:        'grab',
              pointerEvents: 'auto',
              ...glass,
            }}
            onMouseDown={startDrag}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: isDarkMode ? '#e5e7eb' : '#065f46' }}>
                AI Playground
              </p>
              <p className="text-[10px] truncate" style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
                Test mode · {messages.length} msg{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0" onMouseDown={e => e.stopPropagation()}>
              <button onClick={handleMinimize}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                <Maximize2 className="w-3 h-3" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              </button>
              <button onClick={handleClose}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                <X className="w-3 h-3" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── FULL PANEL (open + not minimized) ── */}
        {isTestAIPanelOpen && !isMinimized && (
          <motion.div
            key="full-panel"
            layoutId="ai-morph"
            className="flex flex-col"
            transition={{ layout: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } }}
            style={{
              position:      'absolute',
              bottom:        PANEL_OFFSET,
              right:         PANEL_OFFSET,
              width:         400,
              height:        560,
              maxHeight:     'calc(100vh - 80px)',
              maxWidth:      'calc(100vw - 32px)',
              borderRadius:  24,
              overflow:      'hidden',
              pointerEvents: 'auto',
              ...glass,
            }}
          >
            {/* Header — drag the panel from here */}
            <div
              onMouseDown={startDrag}
              className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
              style={{
                background:   'linear-gradient(135deg,#25D366 0%,#128C7E 50%,#075E54 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                cursor:       'grab',
                borderRadius: '24px 24px 0 0',
              }}
            >
              {/* Avatar + title (pointer-events:none so text doesn't fight drag) */}
              <div className="flex items-center gap-3" style={{ pointerEvents: 'none' }}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-300 border-2 border-[#128C7E]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm leading-tight">AI Playground</span>
                  <span className="text-white/70 text-xs font-medium">Online · Test &amp; Train</span>
                </div>
              </div>

              {/* Buttons — stopPropagation so clicks don't trigger drag */}
              <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
                <button onClick={handleMinimize}
                  className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ scrollbarWidth: 'thin', cursor: 'default', userSelect: 'text' }}
              onMouseDown={e => e.stopPropagation()}
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/15 blur-2xl rounded-full" />
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 border"
                      style={{
                        background:  isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                        boxShadow:   '0 8px 24px rgba(37,211,102,0.1)',
                      }}>
                      <FlaskConical className="w-8 h-8 text-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">Test your Assistant</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[260px] mx-auto">
                      Send a message to see how your AI responds based on its current training.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {['"What are your hours?"', '"How do I book?"', '"Show me services"'].map((q, i) => (
                      <button key={i}
                        onClick={() => setInputValue(q.replace(/"/g, ''))}
                        className="px-3.5 py-1.5 text-[11px] font-medium rounded-full transition-all cursor-pointer border"
                        style={{
                          background:  isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                          color:       isDarkMode ? '#d1d5db' : '#4b5563',
                        }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'ai' && (
                        <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed"
                        style={{
                          borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          background:   msg.role === 'user'
                            ? 'linear-gradient(135deg,#25D366,#128C7E)'
                            : isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                          color:  msg.role === 'user' ? 'white' : isDarkMode ? '#e5e7eb' : '#1f2937',
                          border: msg.role === 'user' ? 'none' : isDarkMode
                            ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                        }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            <div
              className="px-4 py-3 flex-shrink-0"
              style={{
                background:   isDarkMode ? 'rgba(18,18,24,0.98)' : 'rgba(255,255,255,0.98)',
                borderTop:    isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                borderRadius: '0 0 24px 24px',
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              <div className="relative flex items-end rounded-2xl overflow-hidden"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                  border:     isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                }}>
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message your AI..."
                  className="w-full max-h-[100px] min-h-[44px] py-3 pl-4 pr-12 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none"
                  rows={1}
                  style={{ cursor: 'text', userSelect: 'text' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 bottom-1.5 w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  style={{
                    background: inputValue.trim()
                      ? 'linear-gradient(135deg,#25D366,#128C7E)'
                      : isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                    boxShadow: inputValue.trim() ? '0 4px 12px rgba(37,211,102,0.3)' : 'none',
                  }}>
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
              <div className="mt-2 text-center">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  Test mode · Messages aren't saved
                </span>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Signal,
  Wifi,
  Battery,
  Loader2,
  Mic,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TextWithAppleEmojis } from "./TextWithAppleEmojis";

interface PhonePreviewProps {
  isDarkMode: boolean;
  headerColor: string;
  logoUrl: string | null;
  messages: { role: "user" | "assistant"; text: string }[];
  isTyping: boolean;
  isGreetingLoading?: boolean;
  className?: string;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({
  isDarkMode,
  headerColor,
  logoUrl,
  messages,
  isTyping,
  isGreetingLoading = false,
  className = "",
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to get luminance of a hex color
  const getLuminance = (hex: string) => {
    // Handle short hex
    if (hex.length === 4) {
      hex =
        "#" +
        hex[1] +
        hex[1] +
        hex[2] +
        hex[2] +
        hex[3] +
        hex[3];
    }

    if (!/^#[0-9A-F]{6}$/i.test(hex)) return 0; // Default to dark if invalid

    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance;
  };

  const headerTextColor =
    getLuminance(headerColor) > 160
      ? "text-gray-900"
      : "text-white";
  const headerIconColor =
    getLuminance(headerColor) > 160
      ? "text-gray-700"
      : "text-white/80";

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      className={`relative w-full max-w-[360px] mx-auto transform transition-all duration-500 ${className}`}
    >
      {/* Phone Mockup Frame */}
      <div
        className={`
        relative rounded-[3rem] overflow-hidden border-[8px] shadow-2xl transition-colors duration-300 h-[720px] flex flex-col
        ${isDarkMode ? "border-gray-800 bg-gray-950" : "border-gray-900 bg-white"}
      `}
      >
        {/* Status Bar Mockup */}
        <div
          className={`h-12 w-full flex justify-between items-end pb-2 px-6 text-[12px] font-bold ${isDarkMode ? "text-white" : "text-black"} z-20 absolute top-0 left-0 right-0`}
        >
          <span className="ml-2">
            {React.createElement(() => {
              const [time, setTime] = useState(new Date());
              useEffect(() => {
                const timer = setInterval(
                  () => setTime(new Date()),
                  1000,
                );
                return () => clearInterval(timer);
              }, []);
              return time.toLocaleTimeString("en-US", {
                timeZone: "Asia/Dubai",
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              });
            })}
          </span>
          <div className="flex items-center gap-1 mr-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-3.5" />
          </div>
        </div>

        {/* Chat Header */}
        <div
          className="pt-14 pb-4 px-5 shadow-md z-10 transition-colors duration-300 flex items-center gap-4"
          style={{ backgroundColor: headerColor }}
        >
          <button
            className={`${headerIconColor} hover:opacity-100 cursor-pointer`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center border border-white/30">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <MessageSquare className="w-6 h-6 text-white" />
            )}
          </div>

          <div className="flex-1">
            <h3
              className={`font-semibold ${headerTextColor} text-base`}
            >
              AI Assistant
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              <span
                className={`text-xs ${headerTextColor} opacity-90 font-medium`}
              >
                Online
              </span>
            </div>
          </div>

          <button
            className={`${headerIconColor} hover:opacity-100 cursor-pointer`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-50"}`}
        >
          <div className="text-center py-4">
            <span
              className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? "bg-[#1a1a1a] text-gray-400" : "bg-gray-200 text-gray-500"}`}
            >
              Today
            </span>
          </div>

          {/* If explicit loading prop is passed, show it */}
          {isGreetingLoading && messages.length === 0 && (
            <div className="flex justify-start animate-pulse">
              <div
                className={`
                  p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3
                  ${isDarkMode ? "bg-[#1a1a1a] text-gray-100" : "bg-white text-gray-800 border border-gray-100"}
               `}
              >
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm opacity-70">
                  Creating your agent...
                </span>
              </div>
            </div>
          )}

          {/* If NO messages and NO loading, show 'Creating your agent...' as a persistent state to match the preview look */}
          {!isGreetingLoading && messages.length === 0 && (
            <div className="flex justify-start">
              <div
                className={`
                  p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3
                  ${isDarkMode ? "bg-[#1a1a1a] text-gray-100" : "bg-white text-gray-800 border border-gray-100"}
               `}
              >
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm opacity-70">
                  Creating your agent...
                </span>
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap leading-relaxed
                    ${
                      msg.role === "user"
                        ? "text-white rounded-br-none"
                        : `rounded-bl-none ${isDarkMode ? "bg-[#1a1a1a] text-gray-100" : "bg-white text-gray-800 border border-gray-100"}`
                    }
                  `}
                  style={
                    msg.role === "user"
                      ? {
                          backgroundColor: headerColor,
                          color:
                            getLuminance(headerColor) > 160
                              ? "#111827"
                              : "white",
                        }
                      : {}
                  }
                >
                  <TextWithAppleEmojis text={msg.text} />
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div
                  className={`
                    p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center h-10
                    ${isDarkMode ? "bg-[#1a1a1a] text-gray-100" : "bg-white text-gray-800 border border-gray-100"}
                 `}
                >
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div
          className={`p-4 ${isDarkMode ? "bg-[#0f0f0f]" : "bg-gray-50"}`}
        >
          <div
            className={`rounded-full px-4 py-3 flex items-center justify-between gap-3 ${isDarkMode ? "bg-[#1a1a1a] border border-gray-800" : "bg-white border border-gray-200"} shadow-sm`}
          >
            <input
              type="text"
              placeholder="Type a message..."
              className={`flex-1 bg-transparent border-none outline-none text-sm ${isDarkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
              disabled
            />
            <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"}`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>

        {/* Home Bar */}
        <div
          className={`h-6 w-full flex justify-center items-center ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
        >
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
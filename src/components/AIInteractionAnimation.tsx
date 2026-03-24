import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, User, Send } from 'lucide-react';

const queries = [
  "What are your business hours?",
  "How can I track my order?",
  "Do you offer refunds?",
  "What payment methods do you accept?",
  "How do I reset my password?"
];

const responses = [
  "We're open Monday-Friday, 9 AM to 6 PM EST",
  "You can track your order using the tracking number sent to your email",
  "Yes! We offer a 30-day money-back guarantee",
  "We accept all major credit cards, PayPal, and Apple Pay",
  "Click 'Forgot Password' on the login page to reset it"
];

export const AIInteractionAnimation: React.FC = () => {
  const [currentQueryIndex, setCurrentQueryIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showResponse, setShowResponse] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([]);

  useEffect(() => {
    const currentQuery = queries[currentQueryIndex];
    
    if (isTyping && displayedText.length < currentQuery.length) {
      // Typing the query
      const timeout = setTimeout(() => {
        setDisplayedText(currentQuery.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (isTyping && displayedText.length === currentQuery.length) {
      // Finished typing, send message after a brief pause
      const timeout = setTimeout(() => {
        setMessages(prev => [...prev, { type: 'user', text: currentQuery }]);
        setDisplayedText('');
        setIsTyping(false);
        setShowResponse(true);
      }, 500);
      return () => clearTimeout(timeout);
    } else if (showResponse) {
      // Show bot response
      const timeout = setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: responses[currentQueryIndex] }]);
        setShowResponse(false);
        
        // Move to next query after showing response
        setTimeout(() => {
          const nextIndex = (currentQueryIndex + 1) % queries.length;
          
          // Clear messages if starting over
          if (nextIndex === 0) {
            setMessages([]);
          }
          
          setCurrentQueryIndex(nextIndex);
          setIsTyping(true);
        }, 2000);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isTyping, showResponse, currentQueryIndex]);

  return (
    <div className="w-full max-w-lg">
      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-xs">Online</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[85%]">
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator for Bot */}
            {showResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-gray-800 shadow-md flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-3 border border-gray-200 dark:border-gray-600">
              <input
                type="text"
                value={displayedText}
                readOnly
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
              {isTyping && displayedText && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-0.5 h-4 bg-blue-600 ml-0.5"
                />
              )}
            </div>
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                displayedText
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Send className="w-4 h-4 text-white ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Feature Tags */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⚡ Instant Responses</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🤖 AI Powered</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📱 24/7 Available</span>
        </motion.div>
      </div>
    </div>
  );
};

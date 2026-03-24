import React, { useState } from 'react';
import { Network, MessageSquare, Plus, Zap, ArrowRight, Bot, Database, Workflow as WorkflowIcon, CreditCard, ChevronRight, Puzzle, Sparkles, Send, MoveDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkflowProps {
  onBack: () => void;
}

export function Workflow({ onBack }: WorkflowProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'integrations'>('workflow');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'I can help you adjust your AI\'s workflow. Want to change how it greets users or retrieve bookings? Just let me know!' }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I\'ve updated the workflow! The AI will now present interactive buttons upon entry instead of an open-ended question. You can see these changes reflected in the visualizer.' 
      }]);
    }, 1000);
  };

  const workflowNodes = [
    { id: 1, type: 'trigger', label: 'User Sends Message', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 2, type: 'action', label: 'Welcome & Show Buttons', icon: Bot, color: 'bg-violet-500' },
    { id: 3, type: 'condition', label: 'Retrieve Bookings', icon: Database, color: 'bg-orange-500' },
    { id: 4, type: 'action', label: 'Process Payment', icon: CreditCard, color: 'bg-emerald-500' }
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <div className="w-full p-4 md:p-6 pb-24">
        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'workflow' 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <WorkflowIcon className="w-4 h-4" />
            Workflow Editor
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'integrations' 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            Integrations
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'workflow' && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-sm overflow-hidden"
            >
              {/* Visualizer Area */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 flex flex-col items-center justify-center min-h-[400px] relative border-b border-gray-200 dark:border-gray-700/60">
                <div className="w-full max-w-md space-y-4 relative z-10">
                  {/* Faux Canvas Background */}
                  <div className="absolute inset-0 border border-gray-200 dark:border-gray-700 rounded-xl opacity-20 pointer-events-none -m-4" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(150,150,150,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                  
                  {workflowNodes.map((node, index) => (
                    <div key={node.id} className="relative z-10 flex flex-col items-center">
                      <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:border-violet-400 dark:hover:border-violet-500 transition-colors cursor-grab">
                        <div className={`w-10 h-10 rounded-lg ${node.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                          <node.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{node.label}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {node.type === 'trigger' ? 'Starting point' : node.type === 'condition' ? 'Checks backend' : 'Executes automatically'}
                          </p>
                        </div>
                        <div className="shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Plus className="w-5 h-5" />
                        </div>
                      </div>
                      
                      {index < workflowNodes.length - 1 && (
                        <div className="py-2 text-gray-300 dark:text-gray-600">
                          <MoveDown className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 flex justify-center z-10 relative">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-medium">
                      <Plus className="w-4 h-4" /> Add Action
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Editor Area - Below Visualizer */}
              <div className="flex flex-col h-[300px] bg-white dark:bg-gray-800/80">
                <div className="bg-violet-50/50 dark:bg-violet-900/10 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700/60 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium text-violet-900 dark:text-violet-300">AI Editor Assistant</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-violet-500 text-white rounded-br-sm' 
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tell AI what to change in the workflow above..."
                      className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:text-white transition-all outline-none"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-2 p-1.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FF4F00]/10 flex items-center justify-center text-[#FF4F00]">
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Zapier</h3>
                      <p className="text-xs text-gray-500">Connect to 5,000+ apps</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-4">
                    Trigger workflows or send data from your AI to your favorite tools automatically.
                  </p>
                  <button className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">
                    Connect Zapier
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#9C27B0]/10 flex items-center justify-center text-[#9C27B0]">
                      <Network className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Make (Integromat)</h3>
                      <p className="text-xs text-gray-500">Advanced visual integrations</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-4">
                    Build complex logic and connect multiple apps visually to handle AI outputs.
                  </p>
                  <button className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">
                    Connect Make
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Custom Webhooks</h3>
                    <p className="text-sm text-gray-500">Send HTTP requests to your server</p>
                  </div>
                  <button className="p-2 bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 rounded-lg">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center text-sm text-gray-500">
                  No webhooks configured yet. Add a URL to send real-time data from the workflow.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
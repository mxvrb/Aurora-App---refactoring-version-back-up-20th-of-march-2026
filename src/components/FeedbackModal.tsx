import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  MessageSquare,
  Lightbulb,
  Clock,
  CheckCircle2,
  Users,
  Send,
  Wrench,
  ChevronRight,
  ThumbsUp,
  ArrowLeft,
  Star,
  Zap,
  TrendingUp,
  Shield,
  Mail,
  Bug,
  Upload,
  X,
  ImageIcon,
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

type TabType = 'report-bug' | 'submit' | 'in-progress' | 'completed' | 'community';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'submitted' | 'in-progress' | 'completed' | 'community';
  category: string;
  date: string;
  author?: string;
}

const mockFeedbackData: FeedbackItem[] = [
  // In Progress
  {
    id: '1',
    title: 'Multi-language AI responses',
    description: 'AI should auto-detect customer language and respond accordingly across all platforms.',
    votes: 47,
    status: 'in-progress',
    category: 'Feature',
    date: '2026-02-10',
    author: 'Development Team',
  },
  {
    id: '2',
    title: 'Advanced analytics dashboard',
    description: 'Detailed breakdown of customer interactions, peak hours, and conversion rates.',
    votes: 38,
    status: 'in-progress',
    category: 'Analytics',
    date: '2026-02-05',
    author: 'Development Team',
  },
  {
    id: '3',
    title: 'Scheduled message campaigns',
    description: 'Allow businesses to schedule automated follow-up messages to customers.',
    votes: 31,
    status: 'in-progress',
    category: 'Feature',
    date: '2026-01-28',
    author: 'Development Team',
  },
  // Completed
  {
    id: '4',
    title: 'Dark mode support',
    description: 'Full dark mode implementation across the entire application.',
    votes: 82,
    status: 'completed',
    category: 'UI/UX',
    date: '2026-01-15',
    author: 'Development Team',
  },
  {
    id: '5',
    title: 'WhatsApp integration',
    description: 'Full WhatsApp Business API integration with AI-powered responses.',
    votes: 96,
    status: 'completed',
    category: 'Integration',
    date: '2026-01-02',
    author: 'Development Team',
  },
  {
    id: '6',
    title: 'PDF document upload for AI training',
    description: 'Upload PDF documents to train the AI assistant on business-specific content.',
    votes: 64,
    status: 'completed',
    category: 'Feature',
    date: '2025-12-20',
    author: 'Development Team',
  },
  {
    id: '7',
    title: 'Custom color scheme',
    description: 'Allow businesses to customize the color scheme to match their brand.',
    votes: 55,
    status: 'completed',
    category: 'UI/UX',
    date: '2025-12-10',
    author: 'Development Team',
  },
  // Community
  {
    id: '8',
    title: 'Voice message support',
    description: 'Enable AI to process and respond to voice messages from customers.',
    votes: 72,
    status: 'community',
    category: 'Feature',
    date: '2026-02-18',
    author: 'Sarah M.',
  },
  {
    id: '9',
    title: 'CRM integration (HubSpot, Salesforce)',
    description: 'Sync customer conversations and data with popular CRM platforms.',
    votes: 58,
    status: 'community',
    category: 'Integration',
    date: '2026-02-14',
    author: 'Ahmed K.',
  },
  {
    id: '10',
    title: 'Team collaboration features',
    description: 'Allow multiple team members to manage and respond to conversations.',
    votes: 44,
    status: 'community',
    category: 'Feature',
    date: '2026-02-12',
    author: 'James L.',
  },
  {
    id: '11',
    title: 'AI sentiment analysis',
    description: 'Show real-time sentiment analysis of customer conversations.',
    votes: 39,
    status: 'community',
    category: 'Analytics',
    date: '2026-02-08',
    author: 'Fatima R.',
  },
  {
    id: '12',
    title: 'Automated FAQ generation',
    description: 'Auto-generate FAQ pages from common customer questions.',
    votes: 33,
    status: 'community',
    category: 'Feature',
    date: '2026-02-03',
    author: 'Michael T.',
  },
];

const suggestedImprovements = [
  'Faster AI response times',
  'More customization options',
  'Better mobile experience',
  'Additional language support',
  'Improved analytics',
  'API access for developers',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  userEmail = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('submit');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<string>('Feature');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomIntegration, setShowCustomIntegration] = useState(false);
  const [customIntegrationDesc, setCustomIntegrationDesc] = useState('');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

  // Bug report state
  const [bugDescription, setBugDescription] = useState('');
  const [bugScreenshots, setBugScreenshots] = useState<{ id: string; name: string; url: string }[]>([]);
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);
  const bugFileInputRef = React.useRef<HTMLInputElement>(null);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'submit', label: 'Submit', icon: <Send className="w-3.5 h-3.5" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'in-progress', label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'report-bug', label: 'Report Bug', icon: <Bug className="w-3.5 h-3.5" /> },
  ];

  const categories = ['Feature', 'UI/UX', 'Integration', 'Bug', 'Analytics', 'Other'];

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Feedback submitted successfully! Thank you for helping us improve.');
      setFeedbackText('');
      setFeedbackCategory('Feature');
    }, 1200);
  };

  const handleSubmitQuote = () => {
    if (!customIntegrationDesc.trim()) {
      toast.error('Please describe the custom integration you need');
      return;
    }
    setIsSubmittingQuote(true);
    setTimeout(() => {
      setIsSubmittingQuote(false);
      toast.success('Quote request sent! We\'ll get back to you shortly.');
      setCustomIntegrationDesc('');
      setShowCustomIntegration(false);
    }, 1200);
  };

  const handleVote = (id: string) => {
    setVotedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBugScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not an image file`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setBugScreenshots((prev) => [
          ...prev,
          { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: file.name, url: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so user can re-upload same file
    e.target.value = '';
  };

  const removeBugScreenshot = (id: string) => {
    setBugScreenshots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmitBug = () => {
    if (!bugDescription.trim()) {
      toast.error('Please describe the bug');
      return;
    }
    setIsSubmittingBug(true);
    setTimeout(() => {
      setIsSubmittingBug(false);
      toast.success('Bug report submitted! Our team will investigate shortly.');
      setBugDescription('');
      setBugScreenshots([]);
    }, 1200);
  };

  const getFilteredItems = (status: string) =>
    mockFeedbackData.filter((item) => item.status === status);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Feature': return <Zap className="w-3 h-3" />;
      case 'UI/UX': return <Star className="w-3 h-3" />;
      case 'Integration': return <Wrench className="w-3 h-3" />;
      case 'Analytics': return <TrendingUp className="w-3 h-3" />;
      case 'Bug': return <Shield className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Feature': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'UI/UX': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
      case 'Integration': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Analytics': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Bug': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300';
    }
  };

  const renderFeedbackList = (items: FeedbackItem[], statusLabel: string) => (
    <div className="space-y-3 2xl:space-y-4 max-h-[340px] 2xl:max-h-[500px] min-[1920px]:max-h-[600px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No {statusLabel} feedback yet</p>
        </div>
      ) : (
        items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className="group rounded-xl border border-gray-200/60 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/40 p-3.5 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                  {item.status === 'in-progress' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      <Clock className="w-2.5 h-2.5" />
                      In Progress
                    </span>
                  )}
                  {item.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Done
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.author}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.date}</span>
                </div>
              </div>
              <button
                onClick={() => handleVote(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                  votedItems.has(item.id)
                    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${votedItems.has(item.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${votedItems.has(item.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.votes + (votedItems.has(item.id) ? 1 : 0)}
                </span>
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="mx-auto p-0 overflow-hidden" style={{ maxWidth: '42rem', width: 'calc(100% - 2rem)' }} aria-describedby={undefined}>
        <AnimatePresence mode="wait" initial={false}>
          {showCustomIntegration ? (
            <motion.div
              key="custom-integration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 2xl:p-8"
            >
              <div className="flex items-center gap-3 mb-5 2xl:mb-7">
                <button
                  onClick={() => setShowCustomIntegration(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <div>
                  <h2 className="text-base 2xl:text-lg font-semibold text-gray-900 dark:text-white">Request Custom Integration</h2>
                  <p className="text-xs 2xl:text-sm text-gray-500 dark:text-gray-400">Get a tailored solution for your business</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Custom Built Feature</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Describe the specific feature or integration you'd like built exclusively for your business. Our team will review your request and provide a personalized quote.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Describe your requirements
                  </label>
                  <textarea
                    value={customIntegrationDesc}
                    onChange={(e) => setCustomIntegrationDesc(e.target.value)}
                    placeholder="Tell us what you need... e.g., 'I need a custom booking system integrated with my existing POS software that syncs customer data and sends automated confirmations via SMS.'"
                    className="w-full h-32 2xl:h-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-4 py-3 text-sm 2xl:text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 px-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quote will be sent to <span className="font-medium text-gray-700 dark:text-gray-300">{userEmail || 'your registered email'}</span>
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomIntegration(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitQuote}
                    disabled={isSubmittingQuote || !customIntegrationDesc.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    {isSubmittingQuote ? 'Sending...' : 'Request Quote'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Header */}
              <div className="px-6 2xl:px-8 pt-6 2xl:pt-8 pb-4 2xl:pb-5">
                <DialogHeader className="pb-0">
                  <DialogTitle className="text-center text-base 2xl:text-lg">Give Feedback</DialogTitle>
                </DialogHeader>
                <p className="text-center text-xs 2xl:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Help us make Aces AI better for everyone
                </p>
              </div>

              {/* Tabs */}
              <div className="px-6 2xl:px-8 pb-3 2xl:pb-4">
                <div className="flex rounded-xl bg-gray-100/80 dark:bg-gray-800/60 p-1 gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-6 2xl:px-8 pb-5 2xl:pb-7">
                <AnimatePresence mode="wait">
                  {activeTab === 'report-bug' && (
                    <motion.div
                      key="report-bug"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {/* Bug info banner */}
                      <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-800/30 p-3.5">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                            <Bug className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">Report a Bug</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              Describe the issue you encountered and attach screenshots to help us fix it faster.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bug description */}
                      <div>
                        <label className="text-xs 2xl:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                          What went wrong?
                        </label>
                        <textarea
                          value={bugDescription}
                          onChange={(e) => setBugDescription(e.target.value)}
                          placeholder="Describe the bug... e.g., 'When I click Save on the WhatsApp settings page, the screen freezes and nothing happens. This occurs every time I try to update my greeting message.'"
                          className="w-full h-28 2xl:h-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-4 py-3 text-sm 2xl:text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 resize-none transition-all"
                        />
                      </div>

                      {/* Screenshot upload */}
                      <div>
                        <label className="text-xs 2xl:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                          Screenshots <span className="font-normal text-gray-400 dark:text-gray-500">(optional)</span>
                        </label>

                        <input
                          ref={bugFileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleBugScreenshotUpload}
                          className="hidden"
                        />

                        <button
                          onClick={() => bugFileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all cursor-pointer group"
                        >
                          <Upload className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            Upload Screenshots
                          </span>
                        </button>

                        {/* Screenshot previews */}
                        {bugScreenshots.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {bugScreenshots.map((screenshot) => (
                              <div
                                key={screenshot.id}
                                className="relative group/thumb w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                              >
                                <img
                                  src={screenshot.url}
                                  alt={screenshot.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removeBugScreenshot(screenshot.id)}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                                  <p className="text-[9px] text-white truncate">{screenshot.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {bugScreenshots.length > 0 && (
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            {bugScreenshots.length} screenshot{bugScreenshots.length !== 1 ? 's' : ''} attached
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 px-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Updates will be sent to <span className="font-medium text-gray-700 dark:text-gray-300">{userEmail || 'your registered email'}</span>
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSubmitBug}
                          disabled={isSubmittingBug || !bugDescription.trim()}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                          <Bug className="w-3.5 h-3.5 mr-1.5" />
                          {isSubmittingBug ? 'Submitting...' : 'Submit Bug Report'}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'submit' && (
                    <motion.div
                      key="submit"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {/* Suggested improvements */}
                      <div>
                        <p className="text-xs 2xl:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Quick suggestions</p>
                        <div className="flex flex-wrap gap-1.5 2xl:gap-2">
                          {suggestedImprovements.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => setFeedbackText(suggestion)}
                              className={`px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-full text-xs 2xl:text-sm border transition-all cursor-pointer ${
                                feedbackText === suggestion
                                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-200 dark:hover:border-blue-700'
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <p className="text-xs 2xl:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Category</p>
                        <div className="flex flex-wrap gap-1.5 2xl:gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setFeedbackCategory(cat)}
                              className={`inline-flex items-center gap-1 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-full text-xs 2xl:text-sm border transition-all cursor-pointer ${
                                feedbackCategory === cat
                                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-200 dark:hover:border-blue-700'
                              }`}
                            >
                              {getCategoryIcon(cat)}
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback textarea */}
                      <div>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Tell us what you think, what could be better, or what features you'd love to see..."
                          className="w-full h-28 2xl:h-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-4 py-3 text-sm 2xl:text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-2 px-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Response will be sent to <span className="font-medium text-gray-700 dark:text-gray-300">{userEmail || 'your registered email'}</span>
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSubmitFeedback}
                          disabled={isSubmitting || !feedbackText.trim()}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                        </Button>
                      </div>

                      {/* Custom Integration CTA */}
                      <button
                        onClick={() => setShowCustomIntegration(true)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Request Custom Integration</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Get a personalized quote for a tailored feature</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </button>
                    </motion.div>
                  )}

                  {activeTab === 'in-progress' && (
                    <motion.div
                      key="in-progress"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Features currently being developed based on your feedback</p>
                      {renderFeedbackList(getFilteredItems('in-progress'), 'in-progress')}
                    </motion.div>
                  )}

                  {activeTab === 'completed' && (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Features we've shipped thanks to community feedback</p>
                      {renderFeedbackList(getFilteredItems('completed'), 'completed')}
                    </motion.div>
                  )}

                  {activeTab === 'community' && (
                    <motion.div
                      key="community"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Feedback from other users — vote for what matters to you</p>
                      {renderFeedbackList(getFilteredItems('community'), 'community')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
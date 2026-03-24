import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Bell,
  Send,
  Check,
  ChevronDown,
  User,
  Bot,
  Globe,
  Facebook,
  Mail,
  MessageSquare,
  Filter,
  Instagram,
  Plus,
  Paperclip,
  Star,
  MessageCircle,
  CreditCard,
  Ban,
  UserMinus,
  FolderOpen,
  ArrowRight,
  Loader2,
  File,
  UserPlus,
  WandSparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import whatsappIcon from 'figma:asset/6e1f7ff7a0d2aa0a313a90da33aa60053d91ea17.png';
import instagramLogo from 'figma:asset/a292b19e84a1f879f651078f73cedfa89b695975.png';
import ToolboxIcon from './ToolboxIcon';
import svgPaths from '../imports/svg-9nd5towvhm';
import monitorUpPaths from '../imports/svg-sml4giebh9';
import contactRoundPaths from '../imports/svg-vi1tx7zdml';
import cameraIconPaths from '../imports/svg-fug4bclzvp';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  generateWithOpenAI,
  getBusinessContext,
} from '../utils/openai';
import { MagicalLoadingText } from './MagicalLoadingText';
import LucideBrain from '../imports/LucideBrain';

type Platform = 'whatsapp' | 'instagram' | 'facebook' | 'website' | 'email';

interface ChatMessage {
  sender: 'customer' | 'ai' | 'representative';
  content: string;
  timestamp: string;
  needsRepresentative?: boolean;
}

interface CustomerChat {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  needsAttention: boolean;
  unreadCount: number;
  platform: Platform;
  messages: ChatMessage[];
  isHoveringNeedsResponse?: boolean;
}

interface AllChatsPageProps {
  isDarkMode: boolean;
  onBack: () => void;
  bxChatPaths?: { p27eca190: string; p3c0d9d00: string };
}

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bgColor: string; darkBgColor: string; borderColor: string }> = {
  whatsapp: { label: 'WhatsApp', color: 'text-green-600', bgColor: 'bg-green-500', darkBgColor: 'dark:bg-green-600', borderColor: 'border-green-500' },
  instagram: { label: 'Instagram', color: 'text-pink-600', bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', darkBgColor: '', borderColor: 'border-pink-500' },
  facebook: { label: 'Facebook', color: 'text-blue-600', bgColor: 'bg-blue-600', darkBgColor: 'dark:bg-blue-700', borderColor: 'border-blue-600' },
  website: { label: 'Website', color: 'text-cyan-600', bgColor: 'bg-cyan-500', darkBgColor: 'dark:bg-cyan-600', borderColor: 'border-cyan-500' },
  email: { label: 'Email', color: 'text-violet-600', bgColor: 'bg-violet-500', darkBgColor: 'dark:bg-violet-600', borderColor: 'border-violet-500' },
};

const PlatformIcon = ({ platform, size = 'sm' }: { platform: Platform; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const containerClass = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  switch (platform) {
    case 'whatsapp':
      return (
        <div className={`${containerClass} rounded-full bg-green-500 flex items-center justify-center flex-shrink-0`}>
          <img src={whatsappIcon} alt="WhatsApp" className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
        </div>
      );
    case 'instagram':
      return (
        <div className={`${containerClass} rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center flex-shrink-0`}>
          <img src={instagramLogo} alt="Instagram" className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
        </div>
      );
    case 'facebook':
      return (
        <div className={`${containerClass} rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0`}>
          <Facebook className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-white`} />
        </div>
      );
    case 'website':
      return (
        <div className={`${containerClass} rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0`}>
          <Globe className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-white`} />
        </div>
      );
    case 'email':
      return (
        <div className={`${containerClass} rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0`}>
          <Mail className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-white`} />
        </div>
      );
    default:
      return null;
  }
};

// Initial mock data with platform info
const INITIAL_CHATS: CustomerChat[] = [
  {
    id: 'ac-1',
    name: 'Tobias Hansen',
    phone: '+971 50 123 4567',
    lastMessage: 'Can I get a refund outside the standard policy?',
    time: '2 min ago',
    needsAttention: true,
    unreadCount: 1,
    platform: 'whatsapp',
    messages: [
      { sender: 'customer', content: 'Hi! I have a question about your products.', timestamp: '10:23 AM' },
      { sender: 'ai', content: "Hello! I'm happy to help you. What would you like to know about our products?", timestamp: '10:23 AM' },
      { sender: 'customer', content: 'I bought something last week but I want to return it.', timestamp: '10:24 AM' },
      { sender: 'ai', content: "I understand you'd like to return an item. Our standard return policy allows returns within 14 days of purchase with original packaging. Can you tell me more about your situation?", timestamp: '10:24 AM' },
      { sender: 'customer', content: "Can I get a refund outside the standard policy? It's been 20 days.", timestamp: '10:25 AM', needsRepresentative: true },
      { sender: 'ai', content: "Thank you for your patience. This request requires special consideration. I've transferred your question to a business representative who will assist you shortly.", timestamp: '10:25 AM', needsRepresentative: true },
    ],
  },
  {
    id: 'ac-2',
    name: 'Sarah Mitchell',
    phone: '+971 50 234 5678',
    lastMessage: 'Can I combine these offers in a unique way?',
    time: '15 min ago',
    needsAttention: true,
    unreadCount: 2,
    platform: 'instagram',
    messages: [
      { sender: 'customer', content: 'Hello, I saw you have multiple promotions running.', timestamp: '10:10 AM' },
      { sender: 'ai', content: "Yes! We currently have several promotions available. I can help you understand which ones apply to your purchase. What are you interested in?", timestamp: '10:10 AM' },
      { sender: 'customer', content: 'I want to use the 20% off code and the buy-one-get-one offer together.', timestamp: '10:12 AM' },
      { sender: 'ai', content: "Our promotions typically cannot be combined, but let me check the specific details of your request.", timestamp: '10:12 AM' },
      { sender: 'customer', content: "Can I combine these offers in a unique way? I'm a loyal customer.", timestamp: '10:13 AM', needsRepresentative: true },
      { sender: 'ai', content: "I appreciate your loyalty! This type of special arrangement requires approval from our team. I've transferred your request to a business representative who can discuss custom options with you.", timestamp: '10:13 AM', needsRepresentative: true },
    ],
  },
  {
    id: 'ac-3',
    name: 'Ahmed Al-Mansoori',
    phone: '+971 50 345 6789',
    lastMessage: 'Thank you for the help!',
    time: '1 hour ago',
    needsAttention: false,
    unreadCount: 0,
    platform: 'whatsapp',
    messages: [
      { sender: 'customer', content: 'What are your business hours?', timestamp: '9:15 AM' },
      { sender: 'ai', content: 'Our business hours are Monday to Friday, 9:00 AM - 5:00 PM. How can I assist you today?', timestamp: '9:15 AM' },
      { sender: 'customer', content: "Perfect, I'll visit tomorrow. Thank you!", timestamp: '9:16 AM' },
      { sender: 'ai', content: "You're welcome! We look forward to seeing you tomorrow. Have a great day!", timestamp: '9:16 AM' },
      { sender: 'customer', content: 'Thank you for the help!', timestamp: '9:17 AM' },
    ],
  },
  {
    id: 'ac-4',
    name: 'Emma Rodriguez',
    phone: '+971 50 456 7890',
    lastMessage: 'Do you offer international shipping?',
    time: '2 hours ago',
    needsAttention: false,
    unreadCount: 0,
    platform: 'facebook',
    messages: [
      { sender: 'customer', content: "Hello! I'm interested in your products.", timestamp: '8:30 AM' },
      { sender: 'ai', content: "Welcome! I'd be happy to help you find what you're looking for. What type of products are you interested in?", timestamp: '8:30 AM' },
      { sender: 'customer', content: 'Do you offer international shipping?', timestamp: '8:31 AM' },
      { sender: 'ai', content: 'Yes, we do offer international shipping to many countries. Shipping costs and delivery times vary by destination. Would you like me to check shipping options for your specific location?', timestamp: '8:31 AM' },
      { sender: 'customer', content: "Great! I'll check your website for more details.", timestamp: '8:32 AM' },
      { sender: 'ai', content: 'Perfect! Feel free to reach out if you have any other questions. Happy shopping!', timestamp: '8:32 AM' },
    ],
  },
  {
    id: 'ac-5',
    name: 'Michael Chen',
    phone: '+971 50 567 8901',
    lastMessage: 'Is this product available in blue?',
    time: '3 hours ago',
    needsAttention: false,
    unreadCount: 0,
    platform: 'website',
    messages: [
      { sender: 'customer', content: "Hi, I'm looking at item #1234 on your website.", timestamp: '7:45 AM' },
      { sender: 'ai', content: "Great choice! That's one of our popular items. How can I help you with it?", timestamp: '7:45 AM' },
      { sender: 'customer', content: 'Is this product available in blue?', timestamp: '7:46 AM' },
      { sender: 'ai', content: "Let me check our current inventory for you. Yes, item #1234 is available in blue! Would you like to proceed with an order?", timestamp: '7:46 AM' },
      { sender: 'customer', content: "Yes please! I'll add it to my cart now.", timestamp: '7:47 AM' },
      { sender: 'ai', content: "Excellent! If you need any assistance with checkout, I'm here to help.", timestamp: '7:47 AM' },
    ],
  },
  {
    id: 'ac-6',
    name: 'Fatima Al-Rashid',
    phone: '+971 55 678 9012',
    lastMessage: 'I received the wrong color. Can you help?',
    time: '4 hours ago',
    needsAttention: true,
    unreadCount: 3,
    platform: 'email',
    messages: [
      { sender: 'customer', content: 'Hi, I ordered a black bag but received a brown one.', timestamp: '6:10 AM' },
      { sender: 'ai', content: "I'm sorry to hear about this mix-up! I'd like to help you resolve this. Could you share your order number?", timestamp: '6:10 AM' },
      { sender: 'customer', content: 'Order #ORD-8823. I received the wrong color. Can you help?', timestamp: '6:12 AM', needsRepresentative: true },
      { sender: 'ai', content: "I've found your order. This requires attention from our fulfillment team. A representative will assist you shortly with the exchange.", timestamp: '6:12 AM', needsRepresentative: true },
    ],
  },
  {
    id: 'ac-7',
    name: 'Lucas Fernandez',
    phone: '+971 52 789 0123',
    lastMessage: 'Just placed my order, thanks!',
    time: '5 hours ago',
    needsAttention: false,
    unreadCount: 0,
    platform: 'instagram',
    messages: [
      { sender: 'customer', content: 'Hey! I love your new collection 😍', timestamp: '5:30 AM' },
      { sender: 'ai', content: "Thank you so much! We're thrilled you like it. Is there a specific piece that caught your eye?", timestamp: '5:30 AM' },
      { sender: 'customer', content: 'The leather jacket looks amazing. What sizes do you have?', timestamp: '5:32 AM' },
      { sender: 'ai', content: "The leather jacket is available in S, M, L, and XL. Would you like to place an order?", timestamp: '5:32 AM' },
      { sender: 'customer', content: 'Just placed my order, thanks!', timestamp: '5:35 AM' },
    ],
  },
  {
    id: 'ac-8',
    name: 'Priya Sharma',
    phone: '+971 50 890 1234',
    lastMessage: 'Can I book an appointment for next week?',
    time: '6 hours ago',
    needsAttention: false,
    unreadCount: 1,
    platform: 'facebook',
    messages: [
      { sender: 'customer', content: 'Hello, do you offer consultations?', timestamp: '4:00 AM' },
      { sender: 'ai', content: "Yes, we offer both in-person and virtual consultations! Would you like to schedule one?", timestamp: '4:00 AM' },
      { sender: 'customer', content: 'Can I book an appointment for next week?', timestamp: '4:02 AM' },
      { sender: 'ai', content: "Of course! I can help you with that. What day and time works best for you next week?", timestamp: '4:02 AM' },
    ],
  },
  {
    id: 'ac-9',
    name: 'James Whitfield',
    phone: '+971 56 901 2345',
    lastMessage: 'Thanks for the quick response!',
    time: 'Yesterday',
    needsAttention: false,
    unreadCount: 0,
    platform: 'website',
    messages: [
      { sender: 'customer', content: 'What is your return policy?', timestamp: '3:15 PM' },
      { sender: 'ai', content: 'Our return policy allows returns within 14 days of purchase with original packaging and receipt. Refunds are processed within 5-7 business days.', timestamp: '3:15 PM' },
      { sender: 'customer', content: 'Thanks for the quick response!', timestamp: '3:16 PM' },
    ],
  },
  {
    id: 'ac-10',
    name: 'Noor Al-Hammadi',
    phone: '+971 54 012 3456',
    lastMessage: 'I need help with my subscription',
    time: 'Yesterday',
    needsAttention: false,
    unreadCount: 0,
    platform: 'email',
    messages: [
      { sender: 'customer', content: 'Hello, I need help with my subscription', timestamp: '11:00 AM' },
      { sender: 'ai', content: "I'd be happy to help you with your subscription. Could you tell me what issue you're experiencing?", timestamp: '11:00 AM' },
      { sender: 'customer', content: "I'd like to upgrade to the premium plan", timestamp: '11:02 AM' },
      { sender: 'ai', content: "Great choice! The premium plan includes additional features like priority support and advanced analytics. I'll help you upgrade right away.", timestamp: '11:02 AM' },
    ],
  },
];

export const AllChatsPage: React.FC<AllChatsPageProps> = ({ isDarkMode, onBack, bxChatPaths }) => {
  const [chats, setChats] = useState<CustomerChat[]>(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [visiblePlatforms, setVisiblePlatforms] = useState<Set<Platform>>(
    new Set(['whatsapp', 'instagram', 'facebook', 'website', 'email'])
  );
  const [tempPlatforms, setTempPlatforms] = useState<Set<Platform>>(
    new Set(['whatsapp', 'instagram', 'facebook', 'website', 'email'])
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isBlockRemoveMode, setIsBlockRemoveMode] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);

  // Actions menu state (matching live conversations)
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const canCloseActionsMenuRef = useRef(false);
  const hasHoveredOnceRef = useRef(false);
  const [isOptionsButtonRecharging, setIsOptionsButtonRecharging] = useState(false);

  // Enroll mode state
  const [isEnrollMode, setIsEnrollMode] = useState(false);
  const [enrollClientName, setEnrollClientName] = useState('');
  const [enrollPhoneNumber, setEnrollPhoneNumber] = useState('');
  const [enrollMessageMode, setEnrollMessageMode] = useState<'manual' | 'ai'>('manual');
  const [enrollManualMessage, setEnrollManualMessage] = useState('');
  const [enrollGoal, setEnrollGoal] = useState('');
  const [enrollAIMessage, setEnrollAIMessage] = useState('');
  const [isGeneratingEnrollMessage, setIsGeneratingEnrollMessage] = useState(false);

  // File Send mode state
  const [isFileSendMode, setIsFileSendMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [fileSelectionOrder, setFileSelectionOrder] = useState<string[]>([]);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [isSendingFiles, setIsSendingFiles] = useState(false);

  // Attachment menu state (+ button)
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const dismissTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Auto-select first chat
  useEffect(() => {
    if (!selectedChat && chats.length > 0) {
      const filtered = chats.filter((c) => visiblePlatforms.has(c.platform));
      if (filtered.length > 0) {
        setSelectedChat(filtered[0].id);
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useLayoutEffect(() => {
    if (chatContainerRef.current && selectedChat) {
      const currentCustomer = chats.find((c) => c.id === selectedChat);
      const currentMessageCount = currentCustomer?.messages.length || 0;

      if (currentMessageCount !== prevMessageCountRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        prevMessageCountRef.current = currentMessageCount;
      }
    }
  }, [chats, selectedChat]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
        setTempPlatforms(new Set(visiblePlatforms));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visiblePlatforms]);

  // Click-outside handler for attachment menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isAttachMenuOpen) return;
      const target = event.target as Node;
      if (attachMenuRef.current && !attachMenuRef.current.contains(target)) {
        setIsAttachMenuOpen(false);
      }
    };
    if (isAttachMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttachMenuOpen]);

  // Escape key handler for file send mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFileSendMode) {
        setIsFileSendMode(false);
        setSelectedFiles(new Set());
        setFileSelectionOrder([]);
        setSelectedCustomers(new Set());
        setSelectionOrder([]);
        setFileSearchQuery('');
        setSelectedFileType('all');
        if (chats.length > 0) {
          setSelectedChat(chats[0].id);
        }
      }
    };
    if (isFileSendMode) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isFileSendMode, chats]);

  const filteredChats = chats.filter((chat) => {
    if (!visiblePlatforms.has(chat.platform)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      chat.name.toLowerCase().includes(q) ||
      chat.lastMessage.toLowerCase().includes(q) ||
      chat.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  const sendMessage = () => {
    if (!chatInput.trim() || !selectedChat) return;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    setChats((prev) => {
      const updated = prev.map((c) => {
        if (c.id === selectedChat) {
          return {
            ...c,
            messages: [
              ...c.messages,
              { sender: 'representative' as const, content: chatInput.trim(), timestamp },
            ],
            lastMessage: chatInput.trim().substring(0, 50) + (chatInput.length > 50 ? '...' : ''),
            time: 'Just now',
            unreadCount: 0,
            needsAttention: false,
          };
        }
        return c;
      });
      // Move to top
      const idx = updated.findIndex((c) => c.id === selectedChat);
      if (idx > 0) {
        const [moved] = updated.splice(idx, 1);
        return [moved, ...updated];
      }
      return updated;
    });
    setChatInput('');
    toast.success('Message sent!', { description: 'Your message has been delivered.', duration: 2000 });
  };

  const toggleCustomerSelection = (id: string) => {
    const newSet = new Set(selectedCustomers);
    let newOrder = [...selectionOrder];
    if (newSet.has(id)) {
      newSet.delete(id);
      newOrder = newOrder.filter((i) => i !== id);
    } else {
      newSet.add(id);
      newOrder.push(id);
    }
    setSelectedCustomers(newSet);
    setSelectionOrder(newOrder);
  };

  const selectAllCustomers = () => {
    const allIds = filteredChats.map((c) => c.id);
    setSelectedCustomers(new Set(allIds));
    setSelectionOrder(allIds);
  };

  const clearAllSelections = () => {
    setSelectedCustomers(new Set());
    setSelectionOrder([]);
    setSelectedChat(null);
  };

  const handleBulkAction = (type: string) => {
    if (selectedCustomers.size === 0) {
      toast.error('Please select at least one customer');
      return;
    }
    const count = selectedCustomers.size;
    const actionNames: Record<string, string> = {
      reminder: 'Reminder sent',
      review: 'Review request sent',
      followup: 'Follow-up sent',
      payment: 'Payment link sent',
    };
    toast.success(`${actionNames[type] || 'Action completed'} to ${count} customer${count > 1 ? 's' : ''}`);
    setSelectedCustomers(new Set());
    setSelectionOrder([]);
    setIsSelectionMode(false);
    if (filteredChats.length > 0) setSelectedChat(filteredChats[0].id);
  };

  const handleSaveFilter = () => {
    setVisiblePlatforms(new Set(tempPlatforms));
    setIsFilterOpen(false);
    toast.success('Platform filters updated');
    // Re-check selected chat
    const newFiltered = chats.filter((c) => tempPlatforms.has(c.platform));
    if (selectedChat && !newFiltered.find((c) => c.id === selectedChat)) {
      setSelectedChat(newFiltered.length > 0 ? newFiltered[0].id : null);
    }
  };

  const toggleTempPlatform = (platform: Platform) => {
    const newSet = new Set(tempPlatforms);
    if (newSet.has(platform)) {
      if (newSet.size <= 1) {
        toast.error('You must keep at least one platform visible');
        return;
      }
      newSet.delete(platform);
    } else {
      newSet.add(platform);
    }
    setTempPlatforms(newSet);
  };

  // Mock files data for sending to customers
  const mockSendFiles = [
    { id: 'file-1', name: 'Product_Catalog_2024.pdf', type: 'pdf', size: '2.4 MB', uploadDate: '2024-01-15', icon: 'file' },
    { id: 'file-2', name: 'Price_List.xlsx', type: 'excel', size: '856 KB', uploadDate: '2024-01-14', icon: 'file' },
    { id: 'file-3', name: 'Company_Brochure.pdf', type: 'pdf', size: '5.1 MB', uploadDate: '2024-01-10', icon: 'file' },
    { id: 'file-4', name: 'Service_Agreement.docx', type: 'word', size: '124 KB', uploadDate: '2024-01-08', icon: 'file' },
    { id: 'file-5', name: 'Installation_Guide.pdf', type: 'pdf', size: '1.8 MB', uploadDate: '2024-01-05', icon: 'file' },
    { id: 'file-6', name: 'Warranty_Information.pdf', type: 'pdf', size: '486 KB', uploadDate: '2024-01-03', icon: 'file' },
    { id: 'file-7', name: 'FAQ_Document.pdf', type: 'pdf', size: '732 KB', uploadDate: '2023-12-28', icon: 'file' },
    { id: 'file-8', name: 'Return_Policy.pdf', type: 'pdf', size: '245 KB', uploadDate: '2023-12-20', icon: 'file' },
  ];

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    let newOrder = [...fileSelectionOrder];
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
      newOrder = newOrder.filter(id => id !== fileId);
    } else {
      newSelection.add(fileId);
      newOrder.push(fileId);
    }
    setSelectedFiles(newSelection);
    setFileSelectionOrder(newOrder);
  };

  const selectedCustomer = chats.find((c) => c.id === selectedChat);

  const platformCounts = chats.reduce(
    (acc, chat) => {
      acc[chat.platform] = (acc[chat.platform] || 0) + 1;
      return acc;
    },
    {} as Record<Platform, number>,
  );

  const totalUnread = filteredChats.reduce((sum, c) => sum + c.unreadCount, 0);
  const needsAttentionCount = filteredChats.filter((c) => c.needsAttention).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
            {bxChatPaths ? (
              <div className="w-[22px] h-[22px] flex-none relative">
                <div className="absolute bottom-[9.31%] left-[8.33%] right-1/4 top-1/4 -translate-x-[1px] translate-y-[1px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <path d={bxChatPaths.p27eca190} fill="currentColor" className="text-white" />
                  </svg>
                </div>
                <div className="absolute bottom-[41.67%] left-1/4 right-[8.33%] top-[8.33%] translate-x-[1px] -translate-y-[1px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12">
                    <path d={bxChatPaths.p3c0d9d00} fill="currentColor" className="text-white" />
                  </svg>
                </div>
              </div>
            ) : (
              <MessageSquare className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">All Chats</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isFileSendMode
                ? 'Select customers to send files to'
                : isEnrollMode
                ? 'Preview and enroll new customer'
                : isBlockRemoveMode
                ? 'Select customers to block or remove'
                : isSelectionMode
                  ? 'Select customers to send a special response to'
                  : `${filteredChats.length} conversations across ${visiblePlatforms.size} platform${visiblePlatforms.size > 1 ? 's' : ''}`}
              {!isBlockRemoveMode && !isSelectionMode && !isEnrollMode && !isFileSendMode && totalUnread > 0 && (
                <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                  · {totalUnread} unread
                </span>
              )}
              {!isBlockRemoveMode && !isSelectionMode && !isEnrollMode && !isFileSendMode && needsAttentionCount > 0 && (
                <span className="ml-2 text-red-500 font-medium">
                  · {needsAttentionCount} need{needsAttentionCount === 1 ? 's' : ''} attention
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(isBlockRemoveMode || isSelectionMode || isEnrollMode || isFileSendMode) ? (
            <>
              <button
                onClick={() => {
                  setIsBlockRemoveMode(false);
                  setIsSelectionMode(false);
                  setIsEnrollMode(false);
                  setIsFileSendMode(false);
                  setSelectedCustomers(new Set());
                  setSelectionOrder([]);
                  setIsActionsMenuOpen(false);
                  // Reset enroll form
                  setEnrollClientName('');
                  setEnrollPhoneNumber('');
                  setEnrollMessageMode('manual');
                  setEnrollManualMessage('');
                  setEnrollGoal('');
                  setEnrollAIMessage('');
                  setIsGeneratingEnrollMessage(false);
                  // Reset file send state
                  setSelectedFiles(new Set());
                  setFileSelectionOrder([]);
                  setFileSearchQuery('');
                  setSelectedFileType('all');
                  setIsSendingFiles(false);
                  if (filteredChats.length > 0) setSelectedChat(filteredChats[0].id);
                }}
                className="px-4 py-2 rounded-lg transition-all cursor-pointer bg-gray-700/90 dark:bg-gray-800/90 text-gray-100 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-700 backdrop-blur-sm border border-gray-600/50 dark:border-gray-700/50"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="relative flex items-center">
              {/* Animated Action Buttons */}
              <AnimatePresence>
                {isActionsMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-full mr-3 flex items-center gap-3"
                  >
                    {[
                      {
                        label: 'Block/Remove Customer',
                        color: 'red',
                        onClick: (e: React.MouseEvent) => {
                          e.stopPropagation();
                          setIsBlockRemoveMode(true);
                          setSelectedChat(null);
                          setIsSelectionMode(false);
                          setSelectedCustomers(new Set());
                          setSelectionOrder([]);
                          setIsActionsMenuOpen(false);
                        }
                      },
                      {
                        label: 'Enroll New Customer',
                        color: 'pink',
                        onClick: (e: React.MouseEvent) => {
                          e.stopPropagation();
                          setIsEnrollMode(true);
                          setSelectedChat(null);
                          setIsSelectionMode(false);
                          setIsBlockRemoveMode(false);
                          setSelectedCustomers(new Set());
                          setSelectionOrder([]);
                          // Reset enroll form
                          setEnrollClientName('');
                          setEnrollPhoneNumber('');
                          setEnrollMessageMode('manual');
                          setEnrollManualMessage('');
                          setEnrollGoal('');
                          setEnrollAIMessage('');
                          setIsActionsMenuOpen(false);
                        }
                      },
                      {
                        label: 'Send Files',
                        color: 'blue',
                        onClick: (e: React.MouseEvent) => {
                          e.stopPropagation();
                          setIsFileSendMode(true);
                          setSelectedChat(null);
                          setIsSelectionMode(false);
                          setIsBlockRemoveMode(false);
                          setIsEnrollMode(false);
                          setSelectedCustomers(new Set());
                          setSelectionOrder([]);
                          setSelectedFiles(new Set());
                          setFileSelectionOrder([]);
                          setFileSearchQuery('');
                          setSelectedFileType('all');
                          setIsActionsMenuOpen(false);
                        }
                      },
                      {
                        label: 'Specialized Responses',
                        color: 'purple',
                        onClick: () => {
                          setIsSelectionMode(true);
                          setSelectedChat(null);
                          setIsBlockRemoveMode(false);
                          setSelectedCustomers(new Set());
                          setSelectionOrder([]);
                          setIsActionsMenuOpen(false);
                        }
                      }
                    ].map((action, index) => {
                      const colorClasses = {
                        red: {
                          bg: 'bg-red-100 dark:bg-red-900/20',
                          hover: 'hover:bg-red-200 dark:hover:bg-red-900/30',
                          text: 'text-red-700 dark:text-red-300',
                          border: 'border-red-300 dark:border-red-700',
                          gradient: 'bg-gradient-to-r from-red-500 via-red-600 via-red-700 via-red-600 to-red-500 dark:from-red-300 dark:via-red-500 dark:via-red-700 dark:via-red-500 dark:to-red-300'
                        },
                        blue: {
                          bg: 'bg-blue-100 dark:bg-blue-900/20',
                          hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/30',
                          text: 'text-blue-700 dark:text-blue-300',
                          border: 'border-blue-300 dark:border-blue-700',
                          gradient: 'bg-gradient-to-r from-blue-500 via-blue-600 via-blue-700 via-blue-600 to-blue-500 dark:from-blue-300 dark:via-blue-500 dark:via-blue-700 dark:via-blue-500 dark:to-blue-300'
                        },
                        pink: {
                          bg: 'bg-pink-100 dark:bg-pink-900/20',
                          hover: 'hover:bg-pink-200 dark:hover:bg-pink-900/30',
                          text: 'text-pink-700 dark:text-pink-300',
                          border: 'border-pink-300 dark:border-pink-700',
                          gradient: 'bg-gradient-to-r from-pink-500 via-pink-600 via-pink-700 via-pink-600 to-pink-500 dark:from-pink-300 dark:via-pink-500 dark:via-pink-700 dark:via-pink-500 dark:to-pink-300'
                        },
                        purple: {
                          bg: 'bg-purple-100 dark:bg-purple-900/20',
                          hover: 'hover:bg-purple-200 dark:hover:bg-purple-900/30',
                          text: 'text-purple-700 dark:text-purple-300',
                          border: 'border-purple-300 dark:border-purple-700',
                          gradient: 'bg-gradient-to-r from-purple-500 via-purple-600 via-purple-700 via-purple-600 to-purple-500 dark:from-purple-300 dark:via-purple-500 dark:via-purple-700 dark:via-purple-500 dark:to-purple-300'
                        }
                      };
                      
                      const colors = colorClasses[action.color as keyof typeof colorClasses];
                      
                      return (
                        <motion.button
                          key={action.label}
                          initial={{ 
                            opacity: 0, 
                            x: 50,
                            scale: 0.8
                          }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            scale: 1
                          }}
                          exit={{ 
                            opacity: 0, 
                            x: 50,
                            scale: 0.8
                          }}
                          whileHover={{
                            scale: 1.15,
                            y: -2,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: [0.34, 1.56, 0.64, 1],
                            scale: { duration: 0.2, ease: 'easeOut' }
                          }}
                          onClick={action.onClick}
                          className={`px-3 py-1.5 mx-0 rounded-lg whitespace-nowrap border ${colors.bg} ${colors.hover} ${colors.border} group flex-shrink-0`}
                        >
                          <span 
                            className={`${colors.gradient} bg-clip-text text-transparent gradient-shimmer-hover inline-block`}
                            data-text={action.label}
                          >
                            {action.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Options Button */}
              <button
                ref={(el) => {
                  if (el && isActionsMenuOpen && !canCloseActionsMenuRef.current && hasHoveredOnceRef.current) {
                    el.classList.add('electric-current-animation');
                    setTimeout(() => {
                      el.classList.remove('electric-current-animation');
                    }, 1000);
                  }
                }}
                onMouseEnter={() => {
                  if (!isActionsMenuOpen && !hasHoveredOnceRef.current) {
                    setIsActionsMenuOpen(true);
                    hasHoveredOnceRef.current = true;
                    canCloseActionsMenuRef.current = false;
                    setTimeout(() => {
                      canCloseActionsMenuRef.current = true;
                    }, 1000);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isActionsMenuOpen) {
                    setIsActionsMenuOpen(true);
                    hasHoveredOnceRef.current = true;
                    canCloseActionsMenuRef.current = false;
                    setTimeout(() => {
                      canCloseActionsMenuRef.current = true;
                    }, 1000);
                  } else if (isActionsMenuOpen && canCloseActionsMenuRef.current) {
                    setIsOptionsButtonRecharging(true);
                    setIsActionsMenuOpen(false);
                    canCloseActionsMenuRef.current = false;
                    hasHoveredOnceRef.current = false;
                    setTimeout(() => {
                      setIsOptionsButtonRecharging(false);
                    }, 1500);
                  }
                }}
                className={`relative z-10 px-3 py-1.5 mx-0 rounded-lg whitespace-nowrap border bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-shrink-0 ${
                  isOptionsButtonRecharging 
                    ? '' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-900/30 group'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400 transition-colors duration-150 ${
                  isOptionsButtonRecharging 
                    ? '' 
                    : 'group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                  <ToolboxIcon isOpen={isActionsMenuOpen} isDarkMode={isDarkMode} />
                </div>
                <span className={isOptionsButtonRecharging ? 'text-gray-600 dark:text-gray-400' : 'gradient-text-shimmer'} data-text={isActionsMenuOpen ? "Close" : "Actions"}>{isActionsMenuOpen ? "Close" : "Actions"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Customer List */}
        <div className="w-[380px] border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 flex-shrink-0">
          {/* Search + Filter Row */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {/* Platform Filter Button */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => {
                    setTempPlatforms(new Set(visiblePlatforms));
                    setIsFilterOpen(!isFilterOpen);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    visiblePlatforms.size < 5
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{visiblePlatforms.size < 5 ? visiblePlatforms.size : 'All'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Filter Dropdown */}
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filter Platforms</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Choose which platforms to display</p>
                      </div>
                      <div className="py-2">
                        {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => (
                          <button
                            key={platform}
                            onClick={() => toggleTempPlatform(platform)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <PlatformIcon platform={platform} size="md" />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {PLATFORM_CONFIG[platform].label}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {platformCounts[platform] || 0}
                              </span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                tempPlatforms.has(platform)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                              }`}
                            >
                              {tempPlatforms.has(platform) && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                        <button
                          onClick={() => setTempPlatforms(new Set(['whatsapp', 'instagram', 'facebook', 'website', 'email']))}
                          className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          Select All
                        </button>
                        <button
                          onClick={handleSaveFilter}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Selection Mode Toolbar */}
          {isSelectionMode && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center justify-between mb-3 min-h-[20px]">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100 leading-[20px]">
                  {selectedCustomers.size} selected
                </span>
                <div className="flex items-center space-x-2 min-h-[20px]">
                  <button
                    onClick={selectAllCustomers}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium leading-[20px]"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300 dark:text-gray-600 leading-[20px]">|</span>
                  <button
                    onClick={clearAllSelections}
                    className="text-xs font-medium leading-[20px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'reminder', icon: Bell, label: 'Reminder' },
                  { type: 'review', icon: Star, label: 'Review' },
                  { type: 'followup', icon: MessageCircle, label: 'Follow-up' },
                  { type: 'payment', icon: CreditCard, label: 'Payment' },
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => handleBulkAction(type)}
                    disabled={selectedCustomers.size === 0}
                    className={`flex items-center justify-center space-x-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium transition-colors ${
                      selectedCustomers.size === 0
                        ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Block/Remove Toolbar */}
          {isBlockRemoveMode && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center justify-between mb-3 min-h-[20px]">
                <span className="text-sm font-medium text-red-900 dark:text-red-100 leading-[20px]">
                  {selectedCustomers.size} selected
                </span>
                <div className="flex items-center space-x-2 min-h-[20px]">
                  <button onClick={selectAllCustomers} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium leading-[20px]">
                    Select All
                  </button>
                  <span className="text-gray-300 dark:text-gray-600 leading-[20px]">|</span>
                  <button onClick={clearAllSelections} className="text-xs font-medium leading-[20px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (selectedCustomers.size === 0) { toast.error('Please select at least one customer to block'); return; }
                    toast.success(`${selectedCustomers.size} customer${selectedCustomers.size > 1 ? 's' : ''} blocked`);
                    setSelectedCustomers(new Set());
                    setSelectionOrder([]);
                  }}
                  disabled={selectedCustomers.size === 0}
                  className={`flex items-center justify-center space-x-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium transition-colors ${
                    selectedCustomers.size === 0 ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedCustomers.size === 0) { toast.error('Please select at least one customer to remove'); return; }
                    const count = selectedCustomers.size;
                    setChats((prev) => prev.filter((c) => !selectedCustomers.has(c.id)));
                    toast.success(`${count} customer${count > 1 ? 's' : ''} removed`);
                    setSelectedCustomers(new Set());
                    setSelectionOrder([]);
                    setIsBlockRemoveMode(false);
                  }}
                  disabled={selectedCustomers.size === 0}
                  className={`flex items-center justify-center space-x-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium transition-colors ${
                    selectedCustomers.size === 0 ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer'
                  }`}
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          {isSelectionMode && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium tracking-wider bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {selectedCustomers.size > 0 ? 'Select a response type to send' : 'Please select a customer to send a response to'}
              </p>
            </div>
          )}
          {isBlockRemoveMode && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700">
              <p className="text-xs font-medium tracking-wider bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                {selectedCustomers.size > 0 ? 'Choose an action to perform on selected clients' : 'Please select clients to block or remove'}
              </p>
            </div>
          )}
          {isEnrollMode && (
            <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-700">
              <p className="text-xs font-medium tracking-wider bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-[12px]">
                FILL IN THE FORM ON THE RIGHT TO ENROLL A NEW CUSTOMER
              </p>
            </div>
          )}
          {isFileSendMode && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center justify-between mb-3 min-h-[20px]">
                <span className="text-sm font-medium text-green-900 dark:text-green-100 leading-[20px]">
                  {selectedCustomers.size} selected
                </span>
                <div className="flex items-center space-x-2 min-h-[20px]">
                  <button
                    onClick={selectAllCustomers}
                    className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium leading-[20px] cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300 dark:text-gray-600 leading-[20px]">|</span>
                  <button
                    onClick={clearAllSelections}
                    className="text-xs font-medium leading-[20px] text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          {isFileSendMode && (
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700">
              <p className="text-xs font-medium tracking-wider bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent text-[12px]">
                {selectedCustomers.size > 0
                  ? `Select files to send to ${selectedCustomers.size} customer${selectedCustomers.size > 1 ? 's' : ''}`
                  : 'Please select customers to send files to'}
              </p>
            </div>
          )}
          {isEnrollMode && (
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-l-purple-500">
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {enrollClientName ? enrollClientName.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {enrollClientName || 'New Customer'}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">Preview</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                      {enrollPhoneNumber || '+1 (555) 000-0000'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">No conversations found</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Try a different search term' : 'Adjust your platform filters to see conversations'}
                </p>
              </div>
            ) : (
              filteredChats.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => {
                    if (isSelectionMode || isBlockRemoveMode || isFileSendMode) {
                      toggleCustomerSelection(customer.id);
                    } else {
                      setSelectedChat(customer.id);
                    }
                  }}
                  className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-200 ${
                    isSelectionMode || isBlockRemoveMode || isFileSendMode
                      ? selectedCustomers.has(customer.id)
                        ? isBlockRemoveMode
                          ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-500'
                          : isFileSendMode
                            ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent'
                      : selectedChat === customer.id
                        ? 'bg-gray-100 dark:bg-gray-800 border-l-4 border-l-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Checkbox in selection modes */}
                    {(isSelectionMode || isBlockRemoveMode || isFileSendMode) && (
                      <div className="flex-shrink-0 pt-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedCustomers.has(customer.id)
                              ? isBlockRemoveMode
                                ? 'bg-red-600 border-red-600'
                                : isFileSendMode
                                  ? 'bg-green-600 border-green-600'
                                : 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }`}
                        >
                          {selectedCustomers.has(customer.id) && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    )}

                    {/* Avatar with Platform Badge */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {customer.name.charAt(0)}
                      </div>
                      {/* Platform icon badge */}
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <PlatformIcon platform={customer.platform} size="sm" />
                      </div>
                      {customer.needsAttention && !isSelectionMode && !isBlockRemoveMode && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <Bell className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{customer.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">{customer.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">{customer.lastMessage}</p>
                        {customer.unreadCount > 0 && !isSelectionMode && !isBlockRemoveMode && (
                          <div className="ml-2 min-w-[20px] h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold px-1.5">
                            {customer.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat View */}
        {(() => {
          // Show file browser when in file send mode
          if (isFileSendMode) {
            return (
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                <div 
                  className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#efeae2] dark:bg-gray-900"
                  style={{
                    backgroundImage: isDarkMode 
                      ? 'none'
                      : 'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0,0,0,0.02) 35px, rgba(0,0,0,0.02) 70px)'
                  }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto"
                  >
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Select Files to Send
                            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                              ({mockSendFiles.length} available)
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedFiles.size > 0 
                              ? `${selectedFiles.size} file${selectedFiles.size > 1 ? 's' : ''} selected - Will be sent to ${selectedCustomers.size} customer${selectedCustomers.size > 1 ? 's' : ''}`
                              : `Select files to send to ${selectedCustomers.size} customer${selectedCustomers.size > 1 ? 's' : ''}`}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            toast.info('Files Management coming soon');
                          }}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer"
                        >
                          <FolderOpen className="w-4 h-4" />
                          <span>Manage Files</span>
                        </button>
                      </div>
                      
                      {/* Search and Filter Bar */}
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={fileSearchQuery}
                              onChange={(e) => setFileSearchQuery(e.target.value)}
                              placeholder="Search files..."
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <select
                            value={selectedFileType}
                            onChange={(e) => setSelectedFileType(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          >
                            <option value="all">All Types</option>
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="word">Word</option>
                          </select>
                        </div>
                        
                        {/* Results Count and Active Filters */}
                        {(fileSearchQuery || selectedFileType !== 'all') && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {mockSendFiles.filter(file => {
                                const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase());
                                const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
                                return matchesSearch && matchesType;
                              }).length} {mockSendFiles.filter(file => {
                                const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase());
                                const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
                                return matchesSearch && matchesType;
                              }).length === 1 ? 'file' : 'files'} found
                            </span>
                            <button
                              onClick={() => {
                                setFileSearchQuery('');
                                setSelectedFileType('all');
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              Clear filters
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Actions Bar */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {mockSendFiles.filter(file => {
                          const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase());
                          const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
                          return matchesSearch && matchesType;
                        }).length > 0 && (
                          <button
                            onClick={() => {
                              const filteredFiles = mockSendFiles.filter(file => {
                                const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase());
                                const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
                                return matchesSearch && matchesType;
                              });
                              
                              if (selectedFiles.size === filteredFiles.length) {
                                setSelectedFiles(new Set());
                                setFileSelectionOrder([]);
                              } else {
                                const allIds = filteredFiles.map(f => f.id);
                                setSelectedFiles(new Set(allIds));
                                setFileSelectionOrder(allIds);
                              }
                            }}
                            className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all font-medium cursor-pointer"
                          >
                            {selectedFiles.size === mockSendFiles.filter(file => {
                              const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase());
                              const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
                              return matchesSearch && matchesType;
                            }).length && selectedFiles.size > 0 ? 'Deselect All' : 'Select All'}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Bar */}
                    {selectedFiles.size > 0 && (
                      <div className="mb-4 space-y-3">
                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''} selected
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Files will be sent in this order →
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedFiles(new Set());
                                setFileSelectionOrder([]);
                              }}
                              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
                            >
                              Clear All
                            </button>
                            <button
                              onClick={async () => {
                                if (selectedCustomers.size === 0) {
                                  toast.error('Please select at least one customer on the left');
                                  return;
                                }
                                setIsSendingFiles(true);
                                
                                const selectedFilesList = fileSelectionOrder.map(id => {
                                  return mockSendFiles.find(f => f.id === id);
                                }).filter(f => f !== undefined);
                                
                                // Simulate sending delay
                                await new Promise(resolve => setTimeout(resolve, 800));
                                
                                // Add file messages to ALL selected customers' chats
                                const updatedChats = chats.map(chat => {
                                  if (selectedCustomers.has(chat.id)) {
                                    const now = new Date();
                                    const newMessages = selectedFilesList.map((file) => ({
                                      sender: 'representative' as const,
                                      content: `📎 ${file.name}`,
                                      timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                    }));
                                    return {
                                      ...chat,
                                      messages: [...chat.messages, ...newMessages],
                                      lastMessage: `📎 ${selectedFilesList[selectedFilesList.length - 1].name}`,
                                      time: 'Just now'
                                    };
                                  }
                                  return chat;
                                });
                                
                                setChats(updatedChats);
                                toast.success(`${selectedFiles.size} file${selectedFiles.size > 1 ? 's' : ''} sent to ${selectedCustomers.size} customer${selectedCustomers.size > 1 ? 's' : ''}`, {
                                  description: selectedFilesList.map(f => f.name).join(', ')
                                });
                                
                                // Reset state
                                setSelectedFiles(new Set());
                                setFileSelectionOrder([]);
                                setSelectedCustomers(new Set());
                                setSelectionOrder([]);
                                setIsFileSendMode(false);
                                setFileSearchQuery('');
                                setSelectedFileType('all');
                                setIsSendingFiles(false);
                                
                                if (chats.length > 0) {
                                  setSelectedChat(chats[0].id);
                                }
                              }}
                              disabled={isSendingFiles}
                              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center space-x-2 shadow-md hover:shadow-lg disabled:shadow-none cursor-pointer"
                            >
                              {isSendingFiles ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>Send {selectedFiles.size} File{selectedFiles.size > 1 ? 's' : ''}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Selected Files Preview */}
                        <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          {fileSelectionOrder.map((fileId, index) => {
                            const file = mockSendFiles.find(f => f.id === fileId);
                            if (!file) return null;
                            return (
                              <div
                                key={fileId}
                                className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800"
                              >
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-bold">{index + 1}</span>
                                </div>
                                <File className={`w-4 h-4 flex-shrink-0 ${
                                  file.type === 'pdf' 
                                    ? 'text-red-600 dark:text-red-400' 
                                    : file.type === 'excel'
                                      ? 'text-green-600 dark:text-green-400'
                                      : file.type === 'word'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-purple-600 dark:text-purple-400'
                                }`} />
                                <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[150px]" title={file.name}>
                                  {file.name}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFileSelection(fileId);
                                  }}
                                  className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* File Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mockSendFiles
                        .filter(file => {
                          const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase());
                          const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
                          return matchesSearch && matchesType;
                        })
                        .map((file) => (
                        <div
                          key={file.id}
                          onClick={() => toggleFileSelection(file.id)}
                          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedFiles.has(file.id)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                          }`}
                        >
                          {/* Selection Checkbox with Order */}
                          <div className="absolute top-3 right-3 z-10">
                            {selectedFiles.has(file.id) ? (
                              <div className="relative">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white text-xs font-bold">
                                    {fileSelectionOrder.indexOf(file.id) + 1}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* File Icon */}
                          <div className="mb-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${
                              file.type === 'pdf' 
                                ? 'bg-red-100 dark:bg-red-900/30' 
                                : file.type === 'excel'
                                  ? 'bg-green-100 dark:bg-green-900/30'
                                  : file.type === 'word'
                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                    : 'bg-purple-100 dark:bg-purple-900/30'
                            }`}>
                              <File className={`w-6 h-6 ${
                                file.type === 'pdf' 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : file.type === 'excel'
                                    ? 'text-green-600 dark:text-green-400'
                                    : file.type === 'word'
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-purple-600 dark:text-purple-400'
                              }`} />
                            </div>
                          </div>
                          
                          {/* File Info */}
                          <div className="pr-8">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1.5 truncate" title={file.name}>
                              {file.name}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-medium">{file.size}</span>
                              <span>•</span>
                              <span>{file.uploadDate}</span>
                            </div>
                            <div className="mt-1.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                file.type === 'pdf' 
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  : file.type === 'excel'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                    : file.type === 'word'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                              }`}>
                                {file.type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Empty State - No files at all */}
                    {mockSendFiles.length === 0 && (
                      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FolderOpen className="w-10 h-10 opacity-50" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No files available</h4>
                        <p className="text-sm mb-6 max-w-md mx-auto">Upload files to your Files Management library so you can quickly share them with customers</p>
                        <button
                          onClick={() => {
                            setIsFileSendMode(false);
                            setSelectedFiles(new Set());
                            setFileSelectionOrder([]);
                            toast.info('Files Management coming soon');
                          }}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all inline-flex items-center space-x-2 shadow-md hover:shadow-lg cursor-pointer"
                        >
                          <FolderOpen className="w-4 h-4" />
                          <span>Open Files Management</span>
                        </button>
                      </div>
                    )}
                    
                    {/* No Results State - Files exist but search/filter returned nothing */}
                    {mockSendFiles.length > 0 && 
                     mockSendFiles.filter(file => {
                       const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase());
                       const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
                       return matchesSearch && matchesType;
                     }).length === 0 && (
                      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-10 h-10 opacity-50" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No files found</h4>
                        <p className="text-sm mb-4 max-w-md mx-auto">
                          No files match your search criteria
                        </p>
                        <button
                          onClick={() => {
                            setFileSearchQuery('');
                            setSelectedFileType('all');
                          }}
                          className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all font-medium cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                    
                    {/* Info Note */}
                    {mockSendFiles.length > 0 && selectedFiles.size === 0 && !fileSearchQuery && selectedFileType === 'all' && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p className="font-medium mb-1.5">How it works:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                              <li>Click files to select them (numbers show send order)</li>
                              <li>Files will be sent in the order you select them</li>
                              <li>Selected files will be sent to all {selectedCustomers.size} customer{selectedCustomers.size > 1 ? 's' : ''}</li>
                              <li>Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Esc</kbd> to cancel</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          }

          // Show enrollment form when in enroll mode
          if (isEnrollMode) {
            return (
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                <div 
                  className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#efeae2] dark:bg-gray-900"
                  style={{
                    backgroundImage: isDarkMode 
                      ? 'none'
                      : 'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0,0,0,0.02) 35px, rgba(0,0,0,0.02) 70px)'
                  }}>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto"
                  >
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center space-x-2">
                            <UserPlus className="w-6 h-6 text-purple-600" />
                            <span>Enroll New Customer</span>
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Add a new customer to start automated AI conversations
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Client Name Input */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="ac-enroll-name"
                          className="text-gray-900 dark:text-gray-100"
                        >
                          Client Name *
                        </Label>
                        <Input
                          id="ac-enroll-name"
                          type="text"
                          placeholder="e.g., Sarah Johnson"
                          value={enrollClientName}
                          onChange={(e) => setEnrollClientName(e.target.value)}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      {/* Phone Number Input */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="ac-enroll-phone"
                          className="text-gray-900 dark:text-gray-100"
                        >
                          WhatsApp Phone Number *
                        </Label>
                        <Input
                          id="ac-enroll-phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={enrollPhoneNumber}
                          onChange={(e) => setEnrollPhoneNumber(e.target.value)}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Include country code (e.g., +1 for US)
                        </p>
                      </div>

                      {/* Goal Input (Optional) */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="ac-enroll-goal"
                          className="text-gray-900 dark:text-gray-100 flex items-center space-x-2"
                        >
                          <span>Conversation Goal</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                            (Optional)
                          </span>
                        </Label>
                        <textarea
                          id="ac-enroll-goal"
                          rows={5}
                          placeholder="e.g., Get this client who gets their nails done weekly to book an appointment with us"
                          value={enrollGoal}
                          onChange={(e) => setEnrollGoal(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Describe what you want to achieve with this client.
                          If left empty, AI will handle general conversation.
                        </p>
                      </div>

                      {/* Your Message with integrated AI Generate button */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="ac-enroll-message"
                            className="text-gray-900 dark:text-gray-100"
                          >
                            Your Message *
                          </Label>
                        </div>
                        <div>
                          <textarea
                            id="ac-enroll-message"
                            rows={5}
                            placeholder="Hi! We noticed you get your nails done regularly. We'd love to have you visit our salon..."
                            value={enrollManualMessage}
                            onChange={(e) => setEnrollManualMessage(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                          <div
                            onClick={async () => {
                              if (isGeneratingEnrollMessage) return;
                              setIsGeneratingEnrollMessage(true);
                              toast.info('Generating message...');
                              try {
                                const { companyName, lineOfBusiness } = getBusinessContext();
                                const systemPrompt = `You are a friendly business outreach assistant. Write a short, personalized first message to a new customer. Keep it under 3 sentences. Warm and welcoming.`;
                                const goalText = enrollGoal || "have a friendly conversation";
                                const userPrompt = `Write a first outreach message${enrollClientName ? ` to ${enrollClientName}` : " to a customer"}${companyName ? ` from ${companyName}` : ""}${lineOfBusiness ? ` (${lineOfBusiness})` : ""}. Goal: ${goalText}.`;
                                const generated = await generateWithOpenAI(systemPrompt, userPrompt);
                                setEnrollManualMessage(generated);
                                toast.success("AI message generated!");
                              } catch (error: any) {
                                toast.error(error.message || "Failed to generate message");
                              } finally {
                                setIsGeneratingEnrollMessage(false);
                              }
                            }}
                            className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingEnrollMessage ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingEnrollMessage ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                          >
                            <MagicalLoadingText isLoading={isGeneratingEnrollMessage} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                              <span>Generate using AI</span>
                            </MagicalLoadingText>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEnrollMode(false);
                            // Reset form
                            setEnrollClientName("");
                            setEnrollPhoneNumber("");
                            setEnrollMessageMode("manual");
                            setEnrollManualMessage("");
                            setEnrollGoal("");
                            setEnrollAIMessage("");
                            setIsGeneratingEnrollMessage(false);
                            // Select first customer
                            if (chats.length > 0) {
                              setSelectedChat(chats[0].id);
                            }
                          }}
                          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            // Validate required fields
                            if (!enrollClientName.trim()) {
                              toast.error("Please enter a customer name");
                              return;
                            }
                            if (!enrollPhoneNumber.trim()) {
                              toast.error("Please enter a phone number");
                              return;
                            }
                            if (!enrollManualMessage.trim()) {
                              toast.error("Please write a message or use AI to generate one");
                              return;
                            }

                            // Create new customer chat
                            const newCustomer: CustomerChat = {
                              id: `ac-enroll-${Date.now()}`,
                              name: enrollClientName,
                              phone: enrollPhoneNumber,
                              lastMessage: enrollManualMessage,
                              time: "Just now",
                              unreadCount: 0,
                              needsAttention: false,
                              platform: 'whatsapp',
                              messages: [
                                {
                                  sender: "representative" as const,
                                  content: enrollManualMessage,
                                  timestamp: new Date().toLocaleTimeString(
                                    "en-US",
                                    { hour: "2-digit", minute: "2-digit" },
                                  ),
                                },
                              ],
                            };

                            setChats([newCustomer, ...chats]);

                            // Select the newly enrolled customer's chat FIRST
                            setSelectedChat(newCustomer.id);

                            // Exit enroll mode
                            setIsEnrollMode(false);

                            // Reset form state
                            setEnrollClientName("");
                            setEnrollPhoneNumber("");
                            setEnrollMessageMode("manual");
                            setEnrollManualMessage("");
                            setEnrollGoal("");
                            setEnrollAIMessage("");
                            setIsGeneratingEnrollMessage(false);

                            toast.success(
                              `${enrollClientName} enrolled successfully!`,
                              {
                                description: "Initial message sent via WhatsApp",
                              },
                            );
                          }}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Enroll Customer
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          }

          if (!selectedCustomer) {
            return (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Select a conversation to view</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Choose from your conversations on the left
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedCustomer.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <PlatformIcon platform={selectedCustomer.platform} size="sm" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selectedCustomer.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            PLATFORM_CONFIG[selectedCustomer.platform].color
                          } bg-gray-100 dark:bg-gray-700/50`}
                        >
                          <PlatformIcon platform={selectedCustomer.platform} size="sm" />
                          {PLATFORM_CONFIG[selectedCustomer.platform].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  {selectedCustomer.needsAttention && (
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        const isAnimated = selectedCustomer.isHoveringNeedsResponse;
                        if (!isAnimated) {
                          setChats((prev) =>
                            prev.map((c) =>
                              c.id === selectedCustomer.id ? { ...c, isHoveringNeedsResponse: true } : c,
                            ),
                          );
                        } else {
                          setChats((prev) =>
                            prev.map((c) =>
                              c.id === selectedCustomer.id ? { ...c, needsAttention: false, isHoveringNeedsResponse: false } : c,
                            ),
                          );
                          toast.success('Needs response dismissed');
                        }
                      }}
                      onMouseEnter={() => {
                        if (dismissTimeoutsRef.current[selectedCustomer.id]) {
                          clearTimeout(dismissTimeoutsRef.current[selectedCustomer.id]);
                          delete dismissTimeoutsRef.current[selectedCustomer.id];
                        }
                      }}
                      onMouseLeave={() => {
                        dismissTimeoutsRef.current[selectedCustomer.id] = setTimeout(() => {
                          setChats((prev) =>
                            prev.map((c) =>
                              c.id === selectedCustomer.id ? { ...c, isHoveringNeedsResponse: false } : c,
                            ),
                          );
                          delete dismissTimeoutsRef.current[selectedCustomer.id];
                        }, 750);
                      }}
                    >
                      <div
                        className={`px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg ${
                          !selectedCustomer.isHoveringNeedsResponse ? 'animate-pulse' : ''
                        }`}
                      >
                        <div className="relative">
                          <Bell className="w-4 h-4" />
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: selectedCustomer.isHoveringNeedsResponse ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="w-[1.5px] h-5 bg-white origin-center rounded-full" style={{ transform: 'rotate(-45deg)' }} />
                          </motion.div>
                        </div>
                        <div className="relative overflow-hidden w-[110px]" style={{ height: '20px' }}>
                          <motion.div
                            animate={{ y: selectedCustomer.isHoveringNeedsResponse ? -20 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div style={{ height: '20px', lineHeight: '20px' }} className="flex items-center justify-center whitespace-nowrap">
                              Needs Response
                            </div>
                            <div style={{ height: '20px', lineHeight: '20px' }} className="flex items-center justify-center whitespace-nowrap">
                              Ignore Response
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#efeae2] dark:bg-gray-900"
                style={{
                  backgroundImage: isDarkMode
                    ? 'none'
                    : 'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(0,0,0,0.02) 35px, rgba(0,0,0,0.02) 70px)',
                }}
              >
                {selectedCustomer.messages.map((message, index) => {
                  if (message.sender === 'customer') {
                    return (
                      <div key={index} className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="max-w-[75%] rounded-lg px-4 py-2.5 shadow-sm bg-white dark:bg-gray-800">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                            {message.content}
                          </div>
                          <div className="text-xs mt-1 text-right text-gray-500 dark:text-gray-400">
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (message.sender === 'ai') {
                    return (
                      <div key={index} className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="max-w-[75%] rounded-lg px-4 py-2.5 shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                          <div className="flex items-center space-x-1.5 mb-1.5">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">AI Assistant</span>
                          </div>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                            {message.content}
                          </div>
                          {message.needsRepresentative && (
                            <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700 text-xs text-blue-700 dark:text-blue-300 flex items-center space-x-1 font-medium">
                              <Bell className="w-3 h-3" />
                              <span>Transferred to representative</span>
                            </div>
                          )}
                          <div className="text-xs mt-1 text-right text-gray-500 dark:text-gray-400">
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (message.sender === 'representative') {
                    return (
                      <div key={index} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="max-w-[75%] rounded-lg px-4 py-2.5 shadow-sm bg-green-500 dark:bg-green-600">
                          <div className="flex items-center space-x-1.5 mb-1.5">
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-white">You</span>
                          </div>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                            {message.content}
                          </div>
                          <div className="text-xs mt-1 text-right text-white">
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0">
                <div className="flex items-end space-x-3">
                  {/* Attachment Button with Expandable Menu */}
                  <div ref={attachMenuRef} className="relative pb-2.5">
                    <TooltipProvider>
                      {/* Backdrop blur effect */}
                      <AnimatePresence>
                        {isAttachMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[9998]"
                            style={{ pointerEvents: 'none' }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Expandable Action Buttons */}
                      <AnimatePresence mode="wait">
                        {isAttachMenuOpen && (
                          <motion.div 
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col-reverse gap-3 z-[9999]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {[
                              { gradient: 'from-blue-500 to-indigo-600', label: 'Add File', pathSource: svgPaths, pathKeys: ['p29699900', 'p3f33ac00'], iconSize: 'w-5 h-5', viewBox: '0 0 21 21', onClick: () => {
                                setIsAttachMenuOpen(false);
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*,application/pdf,.doc,.docx,.txt';
                                input.multiple = true;
                                input.onchange = (e) => {
                                  const files = (e.target as HTMLInputElement).files;
                                  if (files && files.length > 0) {
                                    toast.success(`${files.length} file(s) selected`);
                                  }
                                };
                                input.click();
                              }},
                              { gradient: 'from-green-500 to-emerald-600', label: 'Add File From Computer', pathSource: monitorUpPaths, pathKeys: ['p36d37700'], iconSize: 'w-5 h-5', viewBox: '0 0 24 24', onClick: () => {
                                setIsAttachMenuOpen(false);
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*,application/pdf,.doc,.docx,.txt';
                                input.multiple = true;
                                input.onchange = (e) => {
                                  const files = (e.target as HTMLInputElement).files;
                                  if (files && files.length > 0) {
                                    toast.success(`${files.length} file(s) selected`);
                                  }
                                };
                                input.click();
                              }},
                              { gradient: 'from-purple-500 to-violet-600', label: 'AI Assistant', icon: 'bot', iconSize: 'w-5 h-5', viewBox: '0 0 24 24', onClick: () => {
                                setIsAttachMenuOpen(false);
                                toast.info('Opening AI Assistant...');
                              }},
                              { gradient: 'from-red-500 to-rose-600', label: 'Share Staff Contact', pathSource: contactRoundPaths, pathKeys: ['p13e1ce80'], iconSize: 'w-5 h-5', viewBox: '0 0 24 24', onClick: () => {
                                setIsAttachMenuOpen(false);
                                toast.info('Opening staff contacts...');
                              }},
                              { gradient: 'from-yellow-500 to-orange-600', label: 'Use Camera', pathSource: cameraIconPaths, pathKeys: ['p1b108500', 'p16b88f0'], iconSize: 'w-5 h-5', viewBox: '0 0 24 24', onClick: () => {
                                setIsAttachMenuOpen(false);
                                toast.info('Opening camera...');
                              }}
                            ].map((item: any, index) => (
                              <motion.button
                                key={index}
                                initial={{ 
                                  opacity: 0,
                                  scale: 0.3,
                                  y: 30,
                                  rotate: -15
                                }}
                                animate={{ 
                                  opacity: 1,
                                  scale: 1,
                                  y: 0,
                                  rotate: 0
                                }}
                                exit={{ 
                                  opacity: 0,
                                  scale: 0.5,
                                  y: 20,
                                  transition: { 
                                    duration: 0.15,
                                    delay: (2 - index) * 0.03,
                                    ease: [0.4, 0, 1, 1]
                                  }
                                }}
                                transition={{
                                  duration: 0.35,
                                  delay: index * 0.06,
                                  ease: [0.34, 1.56, 0.64, 1]
                                }}
                                whileHover={{ 
                                  scale: 1.15,
                                  rotate: 5,
                                  transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={item.onClick}
                                title={item.label}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative bg-gradient-to-br ${item.gradient}`}
                                style={{
                                  transformOrigin: 'center center'
                                }}
                              >
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ 
                                    delay: index * 0.06 + 0.15,
                                    duration: 0.2,
                                    ease: [0.34, 1.56, 0.64, 1]
                                  }}
                                  className={index === 0 ? 'translate-x-[0.05rem]' : ''}
                                >
                                  {item.icon === 'bot' ? (
                                    <Bot className={`${item.iconSize} text-white`} />
                                  ) : (
                                    <svg className={`${item.iconSize} text-white`} fill="none" preserveAspectRatio="xMidYMid meet" viewBox={item.viewBox}>
                                      <g>
                                        {item.pathKeys?.map((pathKey: string, pathIndex: number) => (
                                          <path 
                                            key={pathIndex}
                                            d={item.pathSource[pathKey]} 
                                            stroke="currentColor" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                          />
                                        ))}
                                      </g>
                                    </svg>
                                  )}
                                </motion.div>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Main Plus Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                            animate={{ 
                              rotate: isAttachMenuOpen ? 135 : 0,
                              scale: isAttachMenuOpen ? 1.1 : 1
                            }}
                            whileHover={{ scale: isAttachMenuOpen ? 1.1 : 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ 
                              duration: 0.3,
                              ease: [0.34, 1.56, 0.64, 1]
                            }}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-colors relative z-[9999]"
                            style={{
                              boxShadow: isAttachMenuOpen ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                            }}
                          >
                            <Plus className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Attach</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex-1 relative">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your response..."
                      className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!chatInput.trim()}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-600 dark:disabled:to-gray-600 text-white rounded-full font-medium transition-all flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100 -translate-y-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </motion.div>
  );
};
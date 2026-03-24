import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Facebook, Instagram, BarChart3, Mail, Plus, ExternalLink, X, Calendar, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { TooltipProvider } from './ui/tooltip';
import { AnimatedEyeIcon } from './AnimatedEyeIcon';
import { AnimatedCounter } from './AnimatedCounter';
import { LoadingDots3D } from './LoadingDots3D';
import { SidebarLogoWithTier } from './SidebarLogoWithTier';
import { PerformanceDial } from './PerformanceDial';
import { WhatsAppDialogs } from './WhatsAppDialogs';
import WhatsAppIcon from './WhatsAppIcon';
import CustomDateRangeSelector from './CustomDateRangeSelector';
import LucideRefreshCw from '../imports/LucideRefreshCw';
import Frame2 from '../imports/Frame2-705-10';
import { Calendar as CalendarComponent } from './ui/calendar';
import { ProtectedImg } from './AppHelpers';
import bxChatPaths from '../imports/svg-dmbq3agwb0';
import logoImage from 'figma:asset/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png';
import instagramLogo from 'figma:asset/a292b19e84a1f879f651078f73cedfa89b695975.png';
import slackIcon from 'figma:asset/94fe5419ed9304104582750fe20291b933363ab5.png';
import telegramIcon from 'figma:asset/9773dbaa1279463ba7491a29151fce5122f37c13.png';
import wechatIcon from 'figma:asset/1ea6553c03e11978b12888ebba7d2635616a891f.png';
import { toast } from 'sonner';

export interface AnalyticsScreenProps {
  userTier: string;
  displayLogoUrl: string | null;
  isDarkMode: boolean;
  isAnalyticsPreviewMode: boolean;
  setIsAnalyticsPreviewMode: (v: boolean) => void;
  selectedAnalyticsPlatform: string;
  setSelectedAnalyticsPlatform: (v: string) => void;
  selectedDateRange: string;
  setSelectedDateRange: (v: string) => void;
  isRefreshingAnalytics: boolean;
  setIsRefreshingAnalytics: (v: boolean) => void;
  shouldAnimateCounters: boolean;
  setShouldAnimateCounters: (v: boolean) => void;
  hasSeenAnalyticsAnimation: boolean;
  setHasSeenAnalyticsAnimation: (v: boolean) => void;
  isEyeAnimating: boolean;
  setIsEyeAnimating: (v: boolean) => void;
  isHoveringAnalyticsCard: boolean;
  setIsHoveringAnalyticsCard: (v: boolean) => void;
  showCustomDatePicker: boolean;
  setShowCustomDatePicker: (v: boolean) => void;
  customStartDate: Date | undefined;
  setCustomStartDate: (v: Date | undefined) => void;
  customEndDate: Date | undefined;
  setCustomEndDate: (v: Date | undefined) => void;
  datePickerStep: 'start' | 'end';
  setDatePickerStep: (v: 'start' | 'end') => void;
  showAddAppsModal: boolean;
  setShowAddAppsModal: (v: boolean) => void;
  showEnterpriseBubble: boolean;
  enterpriseBubbleOpacity: number;
  enterpriseBubblePosition: { top: number; left: number };
  enterpriseBubbleContext: string | null;
  getBubbleMessage: (context: string | null) => any;
  setCurrentStep: (step: string) => void;
  handleWhatsAppClick: () => void;
  handleWebsiteClick: () => void;
  handleInstagramClick: () => void;
  handleFacebookClick: () => void;
  handleMailClick: () => void;
  handleAnalyticsClick: (e?: React.MouseEvent) => void;
  handleUpgradeFeatureClick: (e: React.MouseEvent, feature: string) => void;
  handleBackToDashboard: () => void;
  // WhatsApp Dialog props
  showConfigureNameDialog: boolean;
  setShowConfigureNameDialog: (v: boolean) => void;
  tempBusinessName: string;
  setTempBusinessName: (v: string) => void;
  handleSaveBusinessName: () => void;
  showEditBioDialog: boolean;
  setShowEditBioDialog: (v: boolean) => void;
  tempBio: string;
  setTempBio: (v: string) => void;
  handleSaveBio: () => void;
  showAddWebsiteDialog: boolean;
  setShowAddWebsiteDialog: (v: boolean) => void;
  tempWebsite: string;
  setTempWebsite: (v: string) => void;
  handleSaveWebsite: () => void;
  showAddEmailDialog: boolean;
  setShowAddEmailDialog: (v: boolean) => void;
  tempBusinessEmail: string;
  setTempBusinessEmail: (v: string) => void;
  handleSaveEmail: () => void;
  showChooseModelDialog: boolean;
  setShowChooseModelDialog: (v: boolean) => void;
  selectedModel: string;
  setSelectedModel: (v: string) => void;
  showSelectTimezoneDialog: boolean;
  setShowSelectTimezoneDialog: (v: boolean) => void;
  tempTimezone: string;
  setTempTimezone: (v: string) => void;
  handleSaveTimezone: () => void;
}

// Generate realistic sample data based on platform and date range
function generateSampleData(platform: string, dateRange: string) {
  const platformBaselines: Record<string, any> = {
    whatsapp: { conversations: 45, visitors: 38, csat: 4.2, duration: { hours: 0, minutes: 2, seconds: 15 }, engagement: 78.5, abandonment: 12.3 },
    web: { conversations: 112, visitors: 89, csat: 4.6, duration: { hours: 0, minutes: 4, seconds: 30 }, engagement: 92.3, abandonment: 8.7 },
    instagram: { conversations: 28, visitors: 23, csat: 4.0, duration: { hours: 0, minutes: 1, seconds: 45 }, engagement: 84.2, abandonment: 15.8 },
    facebook: { conversations: 43, visitors: 35, csat: 4.3, duration: { hours: 0, minutes: 6, seconds: 45 }, engagement: 88.6, abandonment: 11.4 },
    email: { conversations: 153, visitors: 46, csat: 4.7, duration: { hours: 2, minutes: 18, seconds: 0 }, engagement: 91.7, abandonment: 8.3 }
  };
  const dateRangeMultipliers: Record<string, number> = {
    'this-week': 1.0, 'last-week': 0.85, 'this-month': 4.2, 'last-month': 3.8, 'custom-dates': 2.1
  };
  const baseline = platformBaselines[platform] || platformBaselines.whatsapp;
  const multiplier = dateRangeMultipliers[dateRange] || 1.0;
  const addVariance = (value: number, variance = 0.12) => Math.round(value * (1 + (Math.random() - 0.5) * 2 * variance));
  const addVarianceDecimal = (value: number, variance = 0.08) => Math.round((value * (1 + (Math.random() - 0.5) * 2 * variance)) * 10) / 10;
  const calculateDuration = () => {
    if (platform === 'email') {
      return { hours: Math.max(0, baseline.duration.hours + Math.round((Math.random() - 0.5) * 1)), minutes: Math.max(0, Math.min(59, baseline.duration.minutes + Math.round((Math.random() - 0.5) * 20))), seconds: 0 };
    }
    const totalSeconds = Math.max(60, (baseline.duration.minutes * 60) + baseline.duration.seconds + Math.round((Math.random() - 0.5) * 2) * 60 + Math.round((Math.random() - 0.5) * 60));
    return { hours: 0, minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 };
  };
  return { conversations: addVariance(baseline.conversations * multiplier), visitors: addVariance(baseline.visitors * multiplier), csat: addVarianceDecimal(baseline.csat), duration: calculateDuration(), engagement: addVarianceDecimal(baseline.engagement, 0.05), abandonment: addVarianceDecimal(baseline.abandonment, 0.08) };
}

function getDateRangeText(period: string, customStartDate?: Date, customEndDate?: Date): string {
  const now = new Date();
  const formatDate = (date: Date) => `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear().toString().slice(-2)}`;
  let startDate: Date, endDate: Date;
  switch (period) {
    case 'this-week': {
      const d = now.getDay(); startDate = new Date(now); startDate.setDate(now.getDate() + (d === 0 ? -6 : 1 - d)); endDate = new Date(startDate); endDate.setDate(startDate.getDate() + 6); break;
    }
    case 'last-week': {
      const d = now.getDay(); startDate = new Date(now); startDate.setDate(now.getDate() + (d === 0 ? -13 : -6 - d)); endDate = new Date(startDate); endDate.setDate(startDate.getDate() + 6); break;
    }
    case 'this-month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); break;
    case 'last-month': startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); endDate = new Date(now.getFullYear(), now.getMonth(), 0); break;
    case 'custom-dates':
      if (customStartDate && customEndDate) return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
      return 'Select Dates';
    default: {
      const d = now.getDay(); startDate = new Date(now); startDate.setDate(now.getDate() + (d === 0 ? -6 : 1 - d)); endDate = new Date(startDate); endDate.setDate(startDate.getDate() + 6);
    }
  }
  return `${formatDate(startDate!)} - ${formatDate(endDate!)}`;
}

export function AnalyticsScreen(props: AnalyticsScreenProps) {
  const {
    userTier, displayLogoUrl, isDarkMode, isAnalyticsPreviewMode, setIsAnalyticsPreviewMode,
    selectedAnalyticsPlatform, setSelectedAnalyticsPlatform, selectedDateRange, setSelectedDateRange,
    isRefreshingAnalytics, setIsRefreshingAnalytics, shouldAnimateCounters, setShouldAnimateCounters,
    hasSeenAnalyticsAnimation, setHasSeenAnalyticsAnimation, isEyeAnimating, setIsEyeAnimating,
    isHoveringAnalyticsCard, setIsHoveringAnalyticsCard, showCustomDatePicker, setShowCustomDatePicker,
    customStartDate, setCustomStartDate, customEndDate, setCustomEndDate, datePickerStep, setDatePickerStep,
    showAddAppsModal, setShowAddAppsModal, showEnterpriseBubble, enterpriseBubbleOpacity,
    enterpriseBubblePosition, enterpriseBubbleContext, getBubbleMessage, setCurrentStep,
    handleWhatsAppClick, handleWebsiteClick, handleInstagramClick, handleFacebookClick,
    handleMailClick, handleAnalyticsClick, handleUpgradeFeatureClick, handleBackToDashboard,
    showConfigureNameDialog, setShowConfigureNameDialog, tempBusinessName, setTempBusinessName, handleSaveBusinessName,
    showEditBioDialog, setShowEditBioDialog, tempBio, setTempBio, handleSaveBio,
    showAddWebsiteDialog, setShowAddWebsiteDialog, tempWebsite, setTempWebsite, handleSaveWebsite,
    showAddEmailDialog, setShowAddEmailDialog, tempBusinessEmail, setTempBusinessEmail, handleSaveEmail,
    showChooseModelDialog, setShowChooseModelDialog, selectedModel, setSelectedModel,
    showSelectTimezoneDialog, setShowSelectTimezoneDialog, tempTimezone, setTempTimezone, handleSaveTimezone,
  } = props;

  const memoizedSampleData = React.useMemo(() => generateSampleData(selectedAnalyticsPlatform, selectedDateRange), [selectedAnalyticsPlatform, selectedDateRange]);

  const handleAnalyticsRefresh = async () => {
    if (isRefreshingAnalytics) return;
    setIsRefreshingAnalytics(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1400));
      toast.success('Analytics refreshed!', { description: 'Your analytics data has been updated with the latest information.', duration: 3000 });
    } catch (error) {
      toast.error('Failed to refresh analytics', { description: 'Please try again in a moment.', duration: 3000 });
    } finally {
      setIsRefreshingAnalytics(false);
    }
  };

  const handleAnalyticsPreview = () => {
    if (isEyeAnimating) return;
    setIsEyeAnimating(true);
    setTimeout(() => {
      setIsAnalyticsPreviewMode(true);
      setShouldAnimateCounters(true);
      setHasSeenAnalyticsAnimation(true);
      setIsEyeAnimating(false);
    }, 1000);
  };

  const sampleData = memoizedSampleData;
  const isDataVisible = isAnalyticsPreviewMode || (['premium', 'enterprise'].includes(userTier) && selectedAnalyticsPlatform === 'whatsapp');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Fixed Left Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-[#DEDEDE] dark:bg-background border-r border-gray-200/60 dark:border-gray-700/50 flex flex-col items-center py-4 z-50">
        <SidebarLogoWithTier logoSrc={logoImage} alt="Aces AI Logo" tier={userTier} businessLogoUrl={displayLogoUrl} onLogoClick={handleBackToDashboard} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4 -mt-8">
            {/* All Chats */}
            <div onClick={() => setCurrentStep('allChats')} className="group flex items-center justify-center cursor-pointer transition-transform mb-4" title="All Chats">
              <div className="w-[22px] h-[22px] flex-none relative">
                <div className="absolute bottom-[9.31%] left-[8.33%] right-1/4 top-1/4 transition-transform duration-300 group-hover:-translate-x-[0.5px] group-hover:translate-y-[0.5px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16"><path d={bxChatPaths.p27eca190} fill="currentColor" className="text-gray-500 dark:text-gray-400" /></svg>
                </div>
                <div className="absolute bottom-[41.67%] left-1/4 right-[8.33%] top-[8.33%] transition-transform duration-300 group-hover:translate-x-[0.5px] group-hover:-translate-y-[0.5px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12"><path d={bxChatPaths.p3c0d9d00} fill="currentColor" className="text-gray-500 dark:text-gray-400" /></svg>
                </div>
              </div>
            </div>
            {/* WhatsApp */}
            <div onClick={handleWhatsAppClick} className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <div className="w-6 h-6 text-white"><WhatsAppIcon /></div>
            </div>
            {/* Internet Browser */}
            <div onClick={handleWebsiteClick} className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Globe className="w-6 h-6 text-white" />
            </div>
            {/* Instagram */}
            <div onClick={handleInstagramClick} className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <ProtectedImg src={instagramLogo} alt="Instagram" className="w-6 h-6" />
            </div>
            {/* Facebook */}
            <div onClick={handleFacebookClick} className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            {/* Mail */}
            <div onClick={handleMailClick} className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Mail className="w-6 h-6 text-white" />
            </div>
            {/* Add Apps */}
            <div onClick={(e) => handleUpgradeFeatureClick(e, 'extras')} className={`w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${showAddAppsModal ? 'from-amber-400 to-red-400 scale-105 shadow-lg' : 'from-amber-600 to-red-500 hover:from-amber-400 hover:to-red-400 hover:scale-105'}`}>
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {/* AI Analytics at bottom - Active State */}
        <div onClick={(e) => handleAnalyticsClick(e)} className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center cursor-pointer relative shadow-lg ring-2 ring-purple-300 dark:ring-purple-500">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className={`ml-20 min-h-screen overflow-y-auto ${['free', 'basic', 'pro'].includes(userTier) && !isAnalyticsPreviewMode ? 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-800' : 'bg-gray-100 dark:bg-gray-950'}`}>
        <TooltipProvider>
          <div className="p-8 2xl:p-12 max-w-7xl 2xl:max-w-[1600px] min-[1920px]:max-w-[1800px] min-[2560px]:max-w-full mx-auto">
            {['free', 'basic', 'pro'].includes(userTier) && !isAnalyticsPreviewMode ? (
              <>
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">Analytics Dashboard</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Advanced analytics and insights to track your AI performance and customer engagement.</p>
                    <button onClick={() => window.open('https://acesai.me/#pricing', '_blank')} className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      <span>Upgrade to Premium</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-8 left-[calc(50%+32px)] transform -translate-x-1/2">
                  <button onClick={handleAnalyticsPreview} disabled={isEyeAnimating} className={`inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200 opacity-90 hover:opacity-100 ${isEyeAnimating ? 'cursor-wait opacity-75' : ''}`}>
                    <AnimatedEyeIcon isAnimating={isEyeAnimating} className="w-4 h-4" />
                    <span>Preview Analytics</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-8 2xl:mb-10">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h1 className="text-3xl 2xl:text-4xl font-medium text-gray-900 dark:text-gray-100 mb-2">Analytics Dashboard</h1>
                      {isAnalyticsPreviewMode && (
                        <span className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 text-sm rounded-full font-medium border border-white/60 dark:border-gray-600/60 backdrop-blur-md shadow-lg">Preview Mode</span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isAnalyticsPreviewMode ? (
                        <>
                          Preview of AI performance analytics with sample data
                          <span className={`text-xs font-bold text-gray-500 dark:text-gray-500 ml-1 inline-block transition-opacity ease-out ${isHoveringAnalyticsCard ? 'duration-1000' : 'duration-300'}`} style={{ verticalAlign: '0.2em', fontSize: '0.65em', opacity: isHoveringAnalyticsCard ? 1 : 0 }}>
                            *this is not real data
                          </span>
                        </>
                      ) : 'Track your AI performance and customer engagement'}
                    </p>
                  </div>
                  {/* Date Range Selector */}
                  <div className="flex items-center space-x-4 bg-[rgba(0,0,0,0)]">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 dark:text-gray-400">
                        <rect x="2" y="3" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="2" y="3" width="12" height="3" rx="1.5" fill="currentColor" fillOpacity="0.1" />
                        <line x1="5" y1="1" x2="5" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="11" y1="1" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="5" cy="9" r="0.8" fill="currentColor" />
                        <circle cx="8" cy="9" r="0.8" fill="currentColor" />
                        <circle cx="11" cy="9" r="0.8" fill="currentColor" />
                        <circle cx="5" cy="12" r="0.8" fill="currentColor" />
                        <circle cx="8" cy="12" r="0.8" fill="currentColor" />
                      </svg>
                      <span>{getDateRangeText(selectedDateRange, customStartDate, customEndDate)}</span>
                    </div>
                    <CustomDateRangeSelector
                      selectedDateRange={selectedDateRange}
                      customStartDate={customStartDate}
                      customEndDate={customEndDate}
                      onDateRangeChange={(value) => setSelectedDateRange(value)}
                      onSelectDatesClick={() => { setCustomStartDate(undefined); setCustomEndDate(undefined); setDatePickerStep('start'); setShowCustomDatePicker(true); }}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>

                {/* Platform Selector */}
                <div className="mb-8 2xl:mb-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Platform:</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => (isAnalyticsPreviewMode || ['premium', 'enterprise'].includes(userTier)) && setSelectedAnalyticsPlatform('whatsapp')} disabled={!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)} className={`group ${selectedAnalyticsPlatform === 'whatsapp' ? 'bg-green-50 border-green-200' : 'hover:bg-green-50 hover:border-green-200'} ${(!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                          <div className={`w-4 h-4 mr-2 transition-colors ${selectedAnalyticsPlatform === 'whatsapp' ? 'text-green-700' : isDarkMode ? 'text-white group-hover:text-green-700' : 'text-black group-hover:text-green-700'}`}><WhatsAppIcon /></div>
                          <span className={`${selectedAnalyticsPlatform === 'whatsapp' ? 'text-green-700' : 'text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-700'}`}>WhatsApp</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => (isAnalyticsPreviewMode || ['premium', 'enterprise'].includes(userTier)) && setSelectedAnalyticsPlatform('web')} disabled={!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)} className={`group ${selectedAnalyticsPlatform === 'web' ? 'bg-blue-50 border-blue-100' : 'hover:bg-blue-50 hover:border-blue-100'} ${(!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                          <Globe className={`w-4 h-4 mr-2 ${selectedAnalyticsPlatform === 'web' ? 'text-blue-500' : 'text-gray-600 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-500'}`} />
                          <span className={`${selectedAnalyticsPlatform === 'web' ? 'text-blue-500' : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-500'}`}>Web</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => (isAnalyticsPreviewMode || ['premium', 'enterprise'].includes(userTier)) && setSelectedAnalyticsPlatform('instagram')} disabled={!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)} className={`group ${selectedAnalyticsPlatform === 'instagram' ? 'bg-purple-50 border-purple-200' : 'hover:bg-purple-50 hover:border-purple-200'} ${(!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                          <Instagram className={`w-4 h-4 mr-2 ${selectedAnalyticsPlatform === 'instagram' ? 'text-purple-600 dark:text-purple-500' : 'text-gray-600 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-500'}`} />
                          <span className={`${selectedAnalyticsPlatform === 'instagram' ? 'bg-gradient-to-r from-purple-600 to-orange-500 dark:from-purple-500 dark:to-orange-400 bg-clip-text text-transparent' : 'text-gray-900 dark:text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-orange-500 group-hover:bg-clip-text dark:group-hover:text-transparent dark:group-hover:bg-gradient-to-r dark:group-hover:from-purple-500 dark:group-hover:to-orange-400 dark:group-hover:bg-clip-text'}`}>Instagram</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => (isAnalyticsPreviewMode || ['premium', 'enterprise'].includes(userTier)) && setSelectedAnalyticsPlatform('facebook')} disabled={!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)} className={`group ${selectedAnalyticsPlatform === 'facebook' ? 'bg-blue-50 border-blue-200' : 'hover:bg-blue-50 hover:border-blue-200'} ${(!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                          <Facebook className={`w-4 h-4 mr-2 ${selectedAnalyticsPlatform === 'facebook' ? 'text-blue-500' : 'text-gray-600 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-500'}`} />
                          <span className={`${selectedAnalyticsPlatform === 'facebook' ? 'text-blue-500' : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-500'}`}>Facebook</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => (isAnalyticsPreviewMode || ['premium', 'enterprise'].includes(userTier)) && setSelectedAnalyticsPlatform('email')} disabled={!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)} className={`group ${selectedAnalyticsPlatform === 'email' ? 'bg-sky-50 border-sky-100' : 'hover:bg-sky-50 hover:border-sky-100'} ${(!isAnalyticsPreviewMode && !['premium', 'enterprise'].includes(userTier)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                          <Mail className={`w-4 h-4 mr-2 ${selectedAnalyticsPlatform === 'email' ? 'text-sky-400' : 'text-gray-600 dark:text-white group-hover:text-sky-400 dark:group-hover:text-sky-400'}`} />
                          <span className={`${selectedAnalyticsPlatform === 'email' ? 'text-sky-400' : 'text-gray-900 dark:text-gray-100 group-hover:text-sky-400 dark:group-hover:text-sky-400'}`}>Email</span>
                        </Button>
                      </div>
                    </div>
                    {(isAnalyticsPreviewMode || ['premium', 'enterprise'].includes(userTier)) && (
                      <Button variant="outline" size="sm" onClick={handleAnalyticsRefresh} disabled={isRefreshingAnalytics} className={`flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isRefreshingAnalytics ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <LucideRefreshCw className={`w-3.5 h-3.5 text-gray-800 dark:text-gray-200 ${isRefreshingAnalytics ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Analytics Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 2xl:gap-8 mb-8 2xl:mb-12">
                  {/* Conversations */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 dark:text-gray-400">
                          <path d="M2 3.5C2 2.67157 2.67157 2 3.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.3284 13.3284 11 12.5 11H5.5L2 14V3.5Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className="text-gray-600 dark:text-gray-400 text-lg font-medium">Conversations</h3>
                      </div>
                    </div>
                    <div className="text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-1 2xl:mb-2 flex items-center h-10 2xl:h-12">
                      {isRefreshingAnalytics ? <LoadingDots3D /> : (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">
                          <AnimatedCounter target={isDataVisible ? sampleData.conversations : 0} shouldAnimate={shouldAnimateCounters && isDataVisible} duration={2000} />
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total conversations this period</p>
                  </Card>

                  {/* Visitors */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 dark:text-gray-400">
                          <circle cx="5" cy="4.5" r="2.5" fill="currentColor" />
                          <path d="M5 8.5C2.8 8.5 1 10.3 1 12.5v1.5h8v-1.5c0-2.2-1.8-4-4-4z" fill="currentColor" />
                          <circle cx="11" cy="4.5" r="2.5" fill="currentColor" fillOpacity="0.7" />
                          <path d="M11 8.5c-1.1 0-2.1 0.4-2.8 1.1 0.5 0.3 0.8 0.8 0.8 1.4v3h6v-1.5c0-2.2-1.8-4-4-4z" fill="currentColor" fillOpacity="0.7" />
                        </svg>
                        <h3 className="text-gray-600 dark:text-gray-400 text-lg font-medium">Visitors</h3>
                      </div>
                    </div>
                    <div className="text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-1 2xl:mb-2 flex items-center h-10 2xl:h-12">
                      {isRefreshingAnalytics ? <LoadingDots3D /> : (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">
                          <AnimatedCounter target={isDataVisible ? sampleData.visitors : 0} shouldAnimate={shouldAnimateCounters && isDataVisible} duration={2000} />
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Unique visitors who started conversations</p>
                  </Card>

                  {/* CSAT Score */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 dark:text-gray-400">
                          <line x1="2" y1="2" x2="2" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="2" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <rect x="3.5" y="9" width="2" height="4" fill="currentColor" rx="0.3" />
                          <rect x="6.5" y="2" width="2" height="11" fill="currentColor" rx="0.3" />
                          <rect x="9.5" y="7" width="2" height="6" fill="currentColor" rx="0.3" />
                          <rect x="12.5" y="5" width="2" height="8" fill="currentColor" rx="0.3" />
                        </svg>
                        <h3 className="text-gray-600 dark:text-gray-400 text-lg font-medium">CSAT Score</h3>
                      </div>
                    </div>
                    <div className="text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-1 2xl:mb-2 flex items-center h-10 2xl:h-12">
                      {isRefreshingAnalytics ? <LoadingDots3D /> : (isDataVisible ? (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">
                          <AnimatedCounter target={sampleData.csat} shouldAnimate={shouldAnimateCounters} duration={2000} decimals={1} />/5
                        </span>
                      ) : (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">N/A</span>
                      ))}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Customer satisfaction rating</p>
                  </Card>

                  {/* Avg. Conversation Duration */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 dark:text-gray-400">
                          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                          <line x1="8" y1="8" x2="8" y2="5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="8" y1="8" x2="10.5" y2="9.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="8" cy="8" r="0.8" fill="currentColor" />
                        </svg>
                        <h3 className="text-gray-600 dark:text-gray-400 text-lg font-medium">Avg. Conversation Duration</h3>
                      </div>
                    </div>
                    <div className="text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-1 2xl:mb-2 flex items-center h-10 2xl:h-12">
                      {isRefreshingAnalytics ? <LoadingDots3D /> : (isDataVisible ? (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">
                          {selectedAnalyticsPlatform === 'email' ? (
                            <><AnimatedCounter target={sampleData.duration.hours} shouldAnimate={shouldAnimateCounters} duration={2000} />h{' '}<AnimatedCounter target={sampleData.duration.minutes} shouldAnimate={shouldAnimateCounters} duration={2000} />m</>
                          ) : (
                            <><AnimatedCounter target={sampleData.duration.minutes} shouldAnimate={shouldAnimateCounters} duration={2000} />m{' '}<AnimatedCounter target={sampleData.duration.seconds} shouldAnimate={shouldAnimateCounters} duration={2000} />s</>
                          )}
                        </span>
                      ) : (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">0s</span>
                      ))}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Average time per conversation</p>
                  </Card>

                  {/* Engagement Rate */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 dark:text-gray-400">
                          <path d="M3 14 L7 10 L11 12 L16 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <path d="M13 5 L16 5 L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <h3 className="text-gray-600 dark:text-gray-400 text-lg font-medium">Engagement Rate</h3>
                      </div>
                    </div>
                    <div className="text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-1 2xl:mb-2 flex items-center h-10 2xl:h-12">
                      {isRefreshingAnalytics ? <LoadingDots3D /> : (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">
                          <AnimatedCounter target={isDataVisible ? sampleData.engagement : 0} shouldAnimate={shouldAnimateCounters && isDataVisible} duration={2000} decimals={1} suffix="%" />
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Visitors who engaged with the bot</p>
                  </Card>

                  {/* Abandonment Rate */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 text-gray-600 dark:text-gray-400"><Frame2 /></div>
                        <h3 className="text-gray-600 dark:text-gray-400 text-lg font-medium">Abandonment Rate</h3>
                      </div>
                    </div>
                    <div className="text-3xl 2xl:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-1 2xl:mb-2 flex items-center h-10 2xl:h-12">
                      {isRefreshingAnalytics ? <LoadingDots3D /> : (
                        <span onMouseEnter={() => setIsHoveringAnalyticsCard(true)} onMouseLeave={() => setIsHoveringAnalyticsCard(false)} className="inline-block">
                          <AnimatedCounter target={isDataVisible ? sampleData.abandonment : 0} shouldAnimate={shouldAnimateCounters && isDataVisible} duration={2000} decimals={1} suffix="%" />
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Conversations left incomplete</p>
                  </Card>
                </div>

                {/* Performance & Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 2xl:gap-10">
                  {/* Performance Insights */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">Performance Insights</h3>
                    {isRefreshingAnalytics ? (
                      <div className="flex items-center justify-center py-12"><div className="text-center"><LoadingDots3D className="mb-4" /><p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Loading insights...</p></div></div>
                    ) : (isAnalyticsPreviewMode || (selectedAnalyticsPlatform === 'whatsapp' && ['premium', 'enterprise'].includes(userTier))) ? (
                      <div className="space-y-6">
                        {selectedAnalyticsPlatform === 'facebook' ? (
                          <>
                            <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-sky-600 dark:text-sky-400 font-medium">Page Response Rate</div><div className="text-sm text-sky-600 dark:text-sky-400">Facebook Page response rate to customer messages</div></div><div className="text-2xl font-semibold text-sky-600 dark:text-sky-400">94%</div></div>
                            <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-violet-600 dark:text-violet-400 font-medium">Message Seen Rate</div><div className="text-sm text-violet-600 dark:text-violet-400">Percentage of messages opened by recipients</div></div><div className="text-2xl font-semibold text-violet-600 dark:text-violet-400">91%</div></div>
                            <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-slate-600 dark:text-slate-400 font-medium">Bot Interaction Rate</div><div className="text-sm text-slate-600 dark:text-slate-400">Users actively engaging with automated responses</div></div><div className="text-2xl font-semibold text-slate-600 dark:text-slate-400">87%</div></div>
                          </>
                        ) : selectedAnalyticsPlatform === 'instagram' ? (
                          <>
                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-cyan-600 dark:text-cyan-400 font-medium">Message Delivery Rate</div><div className="text-sm text-cyan-600 dark:text-cyan-400">High delivery rate for Instagram DM responses</div></div><div className="text-2xl font-semibold text-cyan-600 dark:text-cyan-400">96%</div></div>
                            <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-pink-600 dark:text-pink-400 font-medium">Story Engagement Rate</div><div className="text-sm text-pink-600 dark:text-pink-400">Users engaging via story interactions and DMs</div></div><div className="text-2xl font-semibold text-pink-600 dark:text-pink-400">73%</div></div>
                          </>
                        ) : selectedAnalyticsPlatform === 'email' ? (
                          <>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-emerald-600 dark:text-emerald-400 font-medium">Email Response Rate</div><div className="text-sm text-emerald-600 dark:text-emerald-400">High response rate for automated email replies</div></div><div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">89%</div></div>
                            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-teal-600 dark:text-teal-400 font-medium">Thread Completion Rate</div><div className="text-sm text-teal-600 dark:text-teal-400">Email conversations resolved to completion</div></div><div className="text-2xl font-semibold text-teal-600 dark:text-teal-400">92%</div></div>
                            <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-lime-600 dark:text-lime-400 font-medium">Spam Filter Avoidance</div><div className="text-sm text-lime-600 dark:text-lime-400">AI emails successfully avoiding spam filters</div></div><div className="text-2xl font-semibold text-lime-600 dark:text-lime-400">97%</div></div>
                          </>
                        ) : (
                          <>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-green-600 dark:text-green-400 font-medium">Response Time</div><div className="text-sm text-green-600 dark:text-green-400">{selectedAnalyticsPlatform === 'web' ? 'Excellent - Under 1 second average' : 'Excellent - Under 2 seconds average'}</div></div><div className="text-2xl font-semibold text-green-600 dark:text-green-400">{selectedAnalyticsPlatform === 'web' ? '99%' : '98%'}</div></div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-blue-600 dark:text-blue-400 font-medium">Resolution Rate</div><div className="text-sm text-blue-600 dark:text-blue-400">{selectedAnalyticsPlatform === 'web' ? 'High resolution rate with instant responses' : 'Most inquiries resolved successfully'}</div></div><div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{selectedAnalyticsPlatform === 'web' ? '91%' : '85%'}</div></div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-purple-600 dark:text-purple-400 font-medium">User Satisfaction</div><div className="text-sm text-purple-600 dark:text-purple-400">{selectedAnalyticsPlatform === 'web' ? 'Excellent user experience ratings' : 'Above industry average'}</div></div><div className="text-2xl font-semibold text-purple-600 dark:text-purple-400">{selectedAnalyticsPlatform === 'web' ? '4.6/5' : '4.2/5'}</div></div>
                            {selectedAnalyticsPlatform === 'web' && (
                              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-center justify-between"><div><div className="text-amber-600 dark:text-amber-400 font-medium">Page Load Speed</div><div className="text-sm text-amber-600 dark:text-amber-400">Chatbot initializes in under 0.8 seconds on average</div></div><div className="text-2xl font-semibold text-amber-600 dark:text-amber-400">0.7s</div></div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-12"><div className="text-center"><PerformanceDial className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No Data Available</p><p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Performance insights will appear once conversations are available on this platform.</p></div></div>
                    )}
                  </Card>

                  {/* Recommendations */}
                  <Card className="p-6 2xl:p-8 shadow-lg bg-white dark:bg-gray-800">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6">AI Recommendations</h3>
                    {isRefreshingAnalytics ? (
                      <div className="flex items-center justify-center py-12"><div className="text-center"><LoadingDots3D className="mb-4" /><p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Generating recommendations...</p></div></div>
                    ) : (isAnalyticsPreviewMode || (selectedAnalyticsPlatform === 'whatsapp' && ['premium', 'enterprise'].includes(userTier))) ? (
                      <div className="space-y-6">
                        {selectedAnalyticsPlatform === 'facebook' ? (
                          <>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"><div className="text-blue-700 dark:text-blue-300 font-medium mb-2">Messenger Automation</div><div className="text-sm text-blue-600 dark:text-blue-400">Implement Facebook Messenger persistent menu and quick replies to improve user flow by 52%.</div></div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg"><div className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Social Commerce Integration</div><div className="text-sm text-indigo-600 dark:text-indigo-400">Connect Facebook Shop with Messenger AI to enable seamless product discovery and ordering.</div></div>
                          </>
                        ) : selectedAnalyticsPlatform === 'instagram' ? (
                          <>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"><div className="text-purple-700 dark:text-purple-300 font-medium mb-2">Visual Content Strategy</div><div className="text-sm text-purple-600 dark:text-purple-400">Leverage Instagram Stories and visual responses to increase user engagement by 45%.</div></div>
                            <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-lg"><div className="text-fuchsia-700 dark:text-fuchsia-300 font-medium mb-2">Hashtag Optimization</div><div className="text-sm text-fuchsia-600 dark:text-fuchsia-400">Use trending hashtags in automated responses to improve discoverability and reach.</div></div>
                          </>
                        ) : selectedAnalyticsPlatform === 'email' ? (
                          <>
                            <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg"><div className="text-sky-700 dark:text-sky-300 font-medium mb-2">Email Template Optimization</div><div className="text-sm text-sky-600 dark:text-sky-400">Optimize email templates based on response patterns to improve engagement by 28%.</div></div>
                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg"><div className="text-cyan-700 dark:text-cyan-300 font-medium mb-2">Automated Follow-up Sequences</div><div className="text-sm text-cyan-600 dark:text-cyan-400">Implement intelligent follow-up sequences to increase conversion rates by 41%.</div></div>
                          </>
                        ) : selectedAnalyticsPlatform === 'web' ? (
                          <>
                            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg"><div className="text-teal-700 dark:text-teal-300 font-medium mb-2">Website Optimization</div><div className="text-sm text-teal-600 dark:text-teal-400">Peak activity between 2PM-6PM. Consider optimizing chatbot placement for better visibility.</div></div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg"><div className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Enhance User Experience</div><div className="text-sm text-indigo-600 dark:text-indigo-400">Add more contextual triggers based on user browsing behavior to increase engagement.</div></div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg"><div className="text-emerald-700 dark:text-emerald-300 font-medium mb-2">Mobile Optimization</div><div className="text-sm text-emerald-600 dark:text-emerald-400">68% of conversations are from mobile users. Consider mobile-first chatbot design.</div></div>
                            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg"><div className="text-rose-700 dark:text-rose-300 font-medium mb-2">Conversion Optimization</div><div className="text-sm text-rose-600 dark:text-rose-400">Add strategic call-to-action prompts in conversations to boost lead generation by 34%.</div></div>
                          </>
                        ) : (
                          <>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg"><div className="text-orange-700 dark:text-orange-300 font-medium mb-2">Optimize Peak Hours</div><div className="text-sm text-orange-600 dark:text-orange-400">Most conversations happen between 10AM-2PM. Consider adding more automated responses during this time.</div></div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"><div className="text-blue-700 dark:text-blue-300 font-medium mb-2">Improve Engagement</div><div className="text-sm text-blue-600 dark:text-blue-400">Add interactive buttons and quick replies to increase user engagement rates.</div></div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"><div className="text-green-700 dark:text-green-300 font-medium mb-2">Expand Features</div><div className="text-sm text-green-600 dark:text-green-400">Consider upgrading to Premium plan for full analytics access and advanced features.</div></div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-12"><div className="text-center"><Bot className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No Recommendations</p><p className="text-gray-400 dark:text-gray-500 text-sm mt-2">AI recommendations will be generated once conversation data is available.</p></div></div>
                    )}
                  </Card>
                </div>
              </>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Add Apps Modal */}
      <AnimatePresence>
        {showAddAppsModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowAddAppsModal(false)}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center space-x-8">
                  <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform"><div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg"><img src={slackIcon} alt="Slack" className="w-full h-full object-cover" /></div><span className="text-gray-900 dark:text-gray-100 font-medium">Slack</span></div>
                  <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform"><div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg"><img src={telegramIcon} alt="Telegram" className="w-full h-full object-cover" /></div><span className="text-gray-900 dark:text-gray-100 font-medium">Telegram</span></div>
                  <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform"><div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg"><img src={wechatIcon} alt="WeChat" className="w-full h-full object-cover" /></div><span className="text-gray-900 dark:text-gray-100 font-medium">WeChat</span></div>
                  <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform"><div className="w-16 h-16 bg-gray-400/30 rounded-2xl flex items-center justify-center shadow-lg"><Plus className="w-8 h-8 text-gray-400" /></div><span className="text-gray-900 dark:text-gray-100 font-medium opacity-60">More</span></div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Date Picker Modal */}
      <Dialog open={showCustomDatePicker} onOpenChange={(open) => { setShowCustomDatePicker(open); if (!open) setDatePickerStep('start'); }}>
        <DialogContent hideClose={true} className="max-w-sm mx-auto">
          <DialogHeader className="text-center relative">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <DialogTitle className="text-xl font-medium">{datePickerStep === 'start' ? 'Select Start Date' : 'Select End Date'}</DialogTitle>
            </div>
            <DialogDescription className="text-gray-500 dark:text-gray-400">{datePickerStep === 'start' ? 'Choose the beginning date for your analytics range.' : 'Choose the ending date for your analytics range.'}</DialogDescription>
            <button onClick={() => { setCustomStartDate(undefined); setCustomEndDate(undefined); setDatePickerStep('start'); setShowCustomDatePicker(false); }} className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="space-y-6 w-full">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${datePickerStep === 'start' ? 'bg-blue-600 text-white shadow-lg' : customStartDate ? 'bg-gray-400 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>1</div>
              <div className={`w-12 h-0.5 transition-all duration-300 ${customStartDate ? 'bg-gray-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${datePickerStep === 'end' ? 'bg-blue-600 text-white shadow-lg' : customEndDate ? 'bg-gray-400 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>2</div>
            </div>
            <div className="relative overflow-hidden w-full min-h-[320px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {datePickerStep === 'start' ? (
                  <motion.div key="start-date" initial={{ x: 0, opacity: 1 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-100%', opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="w-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-full flex justify-center"><div className="border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800"><CalendarComponent mode="single" selected={customStartDate} onSelect={(date) => setCustomStartDate(date)} disabled={(date) => date > new Date()} className="rounded-lg [&_button[aria-selected=true]]:bg-gray-200 [&_button[aria-selected=true]]:text-gray-900 [&_button[aria-selected=true]:hover]:bg-gray-300 dark:[&_button[aria-selected=true]]:bg-gray-700 dark:[&_button[aria-selected=true]]:text-gray-100 dark:[&_button[aria-selected=true]:hover]:bg-gray-600" /></div></div>
                  </motion.div>
                ) : (
                  <motion.div key="end-date" initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="w-full flex flex-col items-center justify-center space-y-4">
                    {customStartDate && (<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 rounded-lg w-full"><p className="text-sm text-blue-700 dark:text-blue-300 text-center font-medium">Start Date: {customStartDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p></div>)}
                    <div className="w-full flex justify-center"><div className="border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800"><CalendarComponent mode="single" selected={customEndDate} onSelect={(date) => setCustomEndDate(date)} disabled={(date) => { const today = new Date(); const minDate = customStartDate || new Date('2020-01-01'); return date < minDate || date > today; }} className="rounded-lg [&_button[aria-selected=true]]:bg-gray-200 [&_button[aria-selected=true]]:text-gray-900 [&_button[aria-selected=true]:hover]:bg-gray-300 dark:[&_button[aria-selected=true]]:bg-gray-700 dark:[&_button[aria-selected=true]]:text-gray-100 dark:[&_button[aria-selected=true]:hover]:bg-gray-600" /></div></div>
                    {customStartDate && customEndDate && (<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-3 rounded-lg w-full"><p className="text-sm text-green-700 dark:text-green-300 text-center font-medium">Selected Range: {customStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {customEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div>)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-600 w-full">
            {datePickerStep === 'start' ? (
              <>
                <Button variant="outline" onClick={() => { setCustomStartDate(undefined); setCustomEndDate(undefined); setDatePickerStep('start'); setShowCustomDatePicker(false); }} className="px-6 py-2 text-gray-600 dark:text-gray-300">Cancel</Button>
                <Button onClick={() => { if (customStartDate) setDatePickerStep('end'); }} disabled={!customStartDate} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-6 py-2">Next</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setDatePickerStep('start'); setCustomEndDate(undefined); }} className="px-6 py-2 text-gray-600 dark:text-gray-300">Back</Button>
                <Button onClick={() => { if (customStartDate && customEndDate) { setSelectedDateRange('custom-dates'); setShowCustomDatePicker(false); setDatePickerStep('start'); } }} disabled={!customEndDate} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-6 py-2">Apply Date Range</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enterprise Feature Bubble */}
      {showEnterpriseBubble && (
        <motion.div className="fixed z-50 pointer-events-none" style={{ top: enterpriseBubblePosition.top - 30, left: enterpriseBubblePosition.left }} initial={{ opacity: 1 }} animate={{ opacity: enterpriseBubbleOpacity }} transition={{ duration: 2, ease: 'easeOut' }}>
          <div className="bg-yellow-50 border-2 border-orange-300 rounded-2xl px-4 py-2 shadow-lg max-w-xs pointer-events-auto relative" style={{ borderColor: '#fed7aa' }}>
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-0 h-0" style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid #fed7aa' }}></div>
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0" style={{ borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '7px solid #fefce8' }}></div>
            {(() => {
              const bubbleContent = getBubbleMessage(enterpriseBubbleContext);
              if (bubbleContent.isSimple) {
                return <div className="text-orange-800 text-sm leading-relaxed">{bubbleContent.message}</div>;
              }
              return (
                <div className="text-orange-800 text-sm leading-relaxed flex items-center gap-1">
                  <span>Only available on </span>
                  {bubbleContent.tierBadge}
                  <span> {bubbleContent.message} </span>
                  <a href="https://acesai.me/#pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700 font-medium" onClick={(e) => e.stopPropagation()}>here</a>
                  <span>.</span>
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}

      {/* WhatsApp Profile Edit Dialogs */}
      <WhatsAppDialogs
        showConfigureNameDialog={showConfigureNameDialog} setShowConfigureNameDialog={setShowConfigureNameDialog}
        tempBusinessName={tempBusinessName} setTempBusinessName={setTempBusinessName} handleSaveBusinessName={handleSaveBusinessName}
        showEditBioDialog={showEditBioDialog} setShowEditBioDialog={setShowEditBioDialog}
        tempBio={tempBio} setTempBio={setTempBio} handleSaveBio={handleSaveBio}
        showAddWebsiteDialog={showAddWebsiteDialog} setShowAddWebsiteDialog={setShowAddWebsiteDialog}
        tempWebsite={tempWebsite} setTempWebsite={setTempWebsite} handleSaveWebsite={handleSaveWebsite}
        showAddEmailDialog={showAddEmailDialog} setShowAddEmailDialog={setShowAddEmailDialog}
        tempBusinessEmail={tempBusinessEmail} setTempBusinessEmail={setTempBusinessEmail} handleSaveEmail={handleSaveEmail}
        showChooseModelDialog={showChooseModelDialog} setShowChooseModelDialog={setShowChooseModelDialog}
        selectedModel={selectedModel} setSelectedModel={setSelectedModel}
        showSelectTimezoneDialog={showSelectTimezoneDialog} setShowSelectTimezoneDialog={setShowSelectTimezoneDialog}
        tempTimezone={tempTimezone} setTempTimezone={setTempTimezone} handleSaveTimezone={handleSaveTimezone}
      />
    </div>
  );
}

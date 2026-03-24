import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Facebook, Mail, BarChart3, Plus, ExternalLink } from 'lucide-react';
import { ProtectedImg } from './AppHelpers';
import { SidebarLogoWithTier } from './SidebarLogoWithTier';
import WhatsAppIcon from './WhatsAppIcon';
import { AnimatedEyeIcon } from './AnimatedEyeIcon';
import logoImage from 'figma:asset/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png';
import instagramLogo from 'figma:asset/a292b19e84a1f879f651078f73cedfa89b695975.png';
import slackIcon from 'figma:asset/94fe5419ed9304104582750fe20291b933363ab5.png';
import telegramIcon from 'figma:asset/9773dbaa1279463ba7491a29151fce5122f37c13.png';
import wechatIcon from 'figma:asset/1ea6553c03e11978b12888ebba7d2635616a891f.png';
import bxChatPaths from '../imports/svg-dmbq3agwb0';

export interface SimplePageScreenProps {
  userTier: string;
  displayLogoUrl: string | null;
  handleBackToDashboard: () => void;
  setCurrentStep: (step: string) => void;
  handleWhatsAppClick: () => void;
  handleWebsiteClick: () => void;
  handleInstagramClick: () => void;
  handleFacebookClick: () => void;
  handleMailClick: () => void;
  handleAnalyticsClick: (e?: React.MouseEvent) => void;
  handleUpgradeFeatureClick: (e: React.MouseEvent, feature: string) => void;
  showAddAppsModal: boolean;
  setShowAddAppsModal: (v: boolean) => void;
  isEyeAnimating: boolean;
  handleInstagramPreview: () => void;
  handleWebPreview: () => void;
  handleFacebookPreview: () => void;
  handleEmailPreview: () => void;
}

// Reusable Add Apps Modal
const AddAppsModal = ({ showAddAppsModal, setShowAddAppsModal }: { showAddAppsModal: boolean; setShowAddAppsModal: (v: boolean) => void }) => (
  <AnimatePresence>
    {showAddAppsModal && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowAddAppsModal(false)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                  <ProtectedImg src={slackIcon} alt="Slack" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium">Slack</span>
              </div>
              <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                  <ProtectedImg src={telegramIcon} alt="Telegram" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium">Telegram</span>
              </div>
              <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                  <ProtectedImg src={wechatIcon} alt="WeChat" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium">WeChat</span>
              </div>
              <div className="flex flex-col items-center space-y-3 cursor-pointer hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gray-400/30 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium opacity-60">More</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Reusable Sidebar for simple page screens
const SimpleSidebar = ({
  userTier, displayLogoUrl, handleBackToDashboard, setCurrentStep,
  handleWhatsAppClick, handleWebsiteClick, handleInstagramClick,
  handleFacebookClick, handleMailClick, handleAnalyticsClick,
  handleUpgradeFeatureClick, showAddAppsModal,
  activeScreen
}: SimplePageScreenProps & { activeScreen: 'instagram' | 'website' | 'facebook' | 'mail' }) => (
  <div className="fixed left-0 top-0 bottom-0 w-20 bg-[#DEDEDE] dark:bg-background border-r border-gray-200/60 dark:border-gray-700/50 flex flex-col items-center py-4 z-50">
    <SidebarLogoWithTier
      logoSrc={logoImage}
      alt="Aces AI Logo"
      tier={userTier}
      onLogoClick={handleBackToDashboard}
      businessLogoUrl={displayLogoUrl}
    />
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4 -mt-8">
        {/* All Chats */}
        <div
          onClick={() => setCurrentStep('allChats')}
          className="group flex items-center justify-center cursor-pointer transition-transform mb-4"
          title="All Chats"
        >
          <div className="w-[22px] h-[22px] flex-none relative">
            <div className="absolute bottom-[9.31%] left-[8.33%] right-1/4 top-1/4 transition-transform duration-300 group-hover:-translate-x-[0.5px] group-hover:translate-y-[0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <path d={bxChatPaths.p27eca190} fill="currentColor" className="text-gray-500 dark:text-gray-400" />
              </svg>
            </div>
            <div className="absolute bottom-[41.67%] left-1/4 right-[8.33%] top-[8.33%] transition-transform duration-300 group-hover:translate-x-[0.5px] group-hover:-translate-y-[0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12">
                <path d={bxChatPaths.p3c0d9d00} fill="currentColor" className="text-gray-500 dark:text-gray-400" />
              </svg>
            </div>
          </div>
        </div>
        {/* WhatsApp */}
        <div
          onClick={handleWhatsAppClick}
          className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-6 h-6 text-white"><WhatsAppIcon /></div>
        </div>
        {/* Internet Browser */}
        <div
          onClick={activeScreen !== 'website' ? handleWebsiteClick : undefined}
          className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-transform ${
            activeScreen === 'website'
              ? 'bg-blue-600 relative shadow-lg ring-2 ring-blue-300 dark:ring-blue-500'
              : 'bg-blue-500 hover:scale-105'
          }`}
        >
          <Globe className="w-6 h-6 text-white" />
        </div>
        {/* Instagram */}
        <div
          onClick={activeScreen !== 'instagram' ? handleInstagramClick : undefined}
          className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-transform ${
            activeScreen === 'instagram'
              ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 relative shadow-lg ring-2 ring-purple-300 dark:ring-purple-500'
              : 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:scale-105'
          }`}
        >
          <ProtectedImg src={instagramLogo} alt="Instagram" className="w-6 h-6" />
        </div>
        {/* Facebook */}
        <div
          onClick={activeScreen !== 'facebook' ? handleFacebookClick : undefined}
          className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-transform ${
            activeScreen === 'facebook'
              ? 'bg-blue-700 relative shadow-lg ring-2 ring-blue-300 dark:ring-blue-500'
              : 'bg-blue-600 hover:scale-105'
          }`}
        >
          <Facebook className="w-6 h-6 text-white" />
        </div>
        {/* Mail */}
        <div
          onClick={activeScreen !== 'mail' ? handleMailClick : undefined}
          className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-transform ${
            activeScreen === 'mail'
              ? 'bg-blue-500 relative shadow-lg ring-2 ring-blue-300 dark:ring-blue-300'
              : 'bg-blue-400 hover:scale-105'
          }`}
        >
          <Mail className="w-6 h-6 text-white" />
        </div>
        {/* Add New App */}
        <div
          onClick={(e) => handleUpgradeFeatureClick(e, 'extras')}
          className={`w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
            showAddAppsModal
              ? 'from-amber-400 to-red-400 scale-105 shadow-lg'
              : 'from-amber-600 to-red-500 hover:from-amber-400 hover:to-red-400 hover:scale-105'
          }`}
        >
          <Plus className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
    {/* AI Analytics at bottom */}
    <div
      onClick={(e) => handleAnalyticsClick(e)}
      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
    >
      <BarChart3 className="w-6 h-6 text-white" />
    </div>
  </div>
);

// Instagram Screen
export const InstagramScreen = (props: SimplePageScreenProps) => (
  <div
    className="min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <SimpleSidebar {...props} activeScreen="instagram" />
    <div className="ml-20 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 min-h-screen overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <img src={instagramLogo} alt="Instagram" className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">Instagram Direct Messages</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect with your customers through Instagram Direct Messages with AI-powered automated responses.
            </p>
            <button
              onClick={() => window.open('https://acesai.me/#pricing', '_blank')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Upgrade to Enterprise</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-[calc(50%+32px)] transform -translate-x-1/2">
          <button
            onClick={props.handleInstagramPreview}
            disabled={props.isEyeAnimating}
            className={`inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200 opacity-90 hover:opacity-100 ${props.isEyeAnimating ? 'cursor-wait opacity-75' : ''}`}
          >
            <AnimatedEyeIcon isAnimating={props.isEyeAnimating} className="w-4 h-4" />
            <span>Preview Instagram</span>
          </button>
        </div>
      </div>
    </div>
    <AddAppsModal showAddAppsModal={props.showAddAppsModal} setShowAddAppsModal={props.setShowAddAppsModal} />
  </div>
);

// Website Screen
export const WebsiteScreen = (props: SimplePageScreenProps) => (
  <div
    className="min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <SimpleSidebar {...props} activeScreen="website" />
    <div className="ml-20 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 min-h-screen overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">Website Integration</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Integrate AI chatbot directly into your website to provide 24/7 customer support and assistance.
            </p>
            <button
              onClick={() => window.open('https://acesai.me/#pricing', '_blank')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Upgrade to Enterprise</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-[calc(50%+32px)] transform -translate-x-1/2">
          <button
            onClick={props.handleWebPreview}
            disabled={props.isEyeAnimating}
            className={`inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200 opacity-90 hover:opacity-100 ${props.isEyeAnimating ? 'cursor-wait opacity-75' : ''}`}
          >
            <AnimatedEyeIcon isAnimating={props.isEyeAnimating} className="w-4 h-4" />
            <span>Preview Website</span>
          </button>
        </div>
      </div>
    </div>
    <AddAppsModal showAddAppsModal={props.showAddAppsModal} setShowAddAppsModal={props.setShowAddAppsModal} />
  </div>
);

// Facebook Screen
export const FacebookScreen = (props: SimplePageScreenProps) => (
  <div
    className="min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <SimpleSidebar {...props} activeScreen="facebook" />
    <div className="ml-20 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 min-h-screen overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Facebook className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">Facebook Messenger</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect with your customers through Facebook Messenger with AI-powered automated responses.
            </p>
            <button
              onClick={() => window.open('https://acesai.me/#pricing', '_blank')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Upgrade to Enterprise</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-[calc(50%+32px)] transform -translate-x-1/2">
          <button
            onClick={props.handleFacebookPreview}
            disabled={props.isEyeAnimating}
            className={`inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200 opacity-90 hover:opacity-100 ${props.isEyeAnimating ? 'cursor-wait opacity-75' : ''}`}
          >
            <AnimatedEyeIcon isAnimating={props.isEyeAnimating} className="w-4 h-4" />
            <span>Preview Facebook</span>
          </button>
        </div>
      </div>
    </div>
    <AddAppsModal showAddAppsModal={props.showAddAppsModal} setShowAddAppsModal={props.setShowAddAppsModal} />
  </div>
);

// Mail Screen
export const MailScreen = (props: SimplePageScreenProps) => (
  <div
    className="min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <SimpleSidebar {...props} activeScreen="mail" />
    <div className="ml-20 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 min-h-screen overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4">Email Integration</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Integrate AI-powered email responses to automatically handle customer inquiries and support requests.
            </p>
            <button
              onClick={() => window.open('https://acesai.me/#pricing', '_blank')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Upgrade to Enterprise</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-[calc(50%+32px)] transform -translate-x-1/2">
          <button
            onClick={props.handleEmailPreview}
            disabled={props.isEyeAnimating}
            className={`inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200 opacity-90 hover:opacity-100 ${props.isEyeAnimating ? 'cursor-wait opacity-75' : ''}`}
          >
            <AnimatedEyeIcon isAnimating={props.isEyeAnimating} className="w-4 h-4" />
            <span>Preview Email</span>
          </button>
        </div>
      </div>
    </div>
    <AddAppsModal showAddAppsModal={props.showAddAppsModal} setShowAddAppsModal={props.setShowAddAppsModal} />
  </div>
);

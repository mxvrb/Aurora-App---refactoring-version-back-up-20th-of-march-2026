import React from 'react';
import { TierIndicator } from './TierIndicator';
import { AcesLogo } from './AcesLogo';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Zap, Crown, Sparkles } from 'lucide-react';
import CilArrowRight from '../imports/CilArrowRight';
import Check from '../imports/Check-1138-470';
import LucideWarehouse from '../imports/LucideWarehouse';
import BusinessOutline1 from '../imports/BusinessOutline-666-59';

interface SidebarLogoWithTierProps {
  logoSrc?: string;
  alt?: string;
  tier: 'basic' | 'pro' | 'premium' | 'enterprise' | 'free';
  onLogoClick: () => void;
  onTierClick?: () => void;
  className?: string;
  businessLogoUrl?: string | null;
}

// Protected Image Component
const ProtectedImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ style, className, ...props }) => {
  const protectionProps = {
    draggable: false,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    onDragStart: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    onMouseDown: (e: React.MouseEvent) => {
      if (e.button === 0) {
        e.preventDefault();
        e.stopPropagation();
      }
      return false;
    },
    style: {
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitUserDrag: 'none',
      KhtmlUserSelect: 'none',
      MozUserDrag: 'none',
      touchAction: 'none'
    } as React.CSSProperties
  };
  
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  React.useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      imgElement.draggable = false;
      imgElement.style.cssText += 'user-select: none !important; -webkit-user-drag: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; touch-action: none !important;';
      
      const preventSelectStart = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      imgElement.addEventListener('selectstart', preventSelectStart);
      
      return () => {
        imgElement.removeEventListener('selectstart', preventSelectStart);
      };
    }
  });
  
  return (
    <img
      {...props}
      ref={imgRef}
      {...protectionProps}
      className={`${className || ''} select-none`}
      style={{
        ...protectionProps.style,
        ...style
      }}
    />
  );
};

const TriggerButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const cleanProps = Object.keys(props).reduce((acc, key) => {
    if (!key.startsWith('_fg')) {
      acc[key] = (props as any)[key];
    }
    return acc;
  }, {} as Record<string, any>);
  
  return <button ref={ref} {...cleanProps} />;
});

export const SidebarLogoWithTier: React.FC<SidebarLogoWithTierProps> = ({ 
  logoSrc,
  alt, 
  tier, 
  onLogoClick, 
  onTierClick,
  className = '',
  businessLogoUrl
}) => {
  const handleTierClick = onTierClick || onLogoClick;
  const [isClicked, setIsClicked] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleClick = () => {
    setIsClicked(true);
    onLogoClick();
    setTimeout(() => setIsClicked(false), 600);
  };

  const getUpgradeInfo = (currentTier: string) => {
    switch (currentTier) {
      case 'free':
        return {
          title: 'Unlock Full Access',
          subtitle: 'Choose your path',
          features: ['Unlock Basic', 'Unlock Pro', 'Unlock Premium'],
          icon: <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />,
          buttonText: 'View All Plans',
          headerGradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          borderColor: 'border-blue-100 dark:border-blue-900',
          buttonGradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
          iconBg: 'bg-white/20',
          checkBg: 'bg-blue-500',
          checkColor: 'text-white',
          fillColor: 'white'
        };
      case 'basic':
        return {
          title: 'Unlock Pro Power',
          subtitle: 'Automate your workflow',
          features: ['Calendar Setup', 'Set Reminders', 'Set Reviews'],
          icon: <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />,
          buttonText: 'Upgrade to Pro',
          headerGradient: 'bg-gradient-to-br from-violet-600 to-indigo-600',
          borderColor: 'border-violet-100 dark:border-violet-900',
          buttonGradient: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700',
          iconBg: 'bg-white/20',
          checkBg: 'bg-violet-600',
          checkColor: 'text-white',
          fillColor: 'white'
        };
      case 'pro':
        return {
          title: 'Go Premium',
          subtitle: 'Scale your business',
          features: ['Personalize AI', 'Manage Staff', 'Follow-ups'],
          icon: <Crown className="w-5 h-5 text-white" strokeWidth={1.5} />,
          buttonText: 'Get Premium',
          headerGradient: 'bg-gradient-to-br from-[#C68C33] to-[#D4A044]',
          borderColor: 'border-amber-100 dark:border-amber-900',
          buttonGradient: 'bg-gradient-to-r from-[#C68C33] to-[#D4A044] hover:from-[#B17A28] hover:to-[#C68C33]',
          iconBg: 'bg-white/20',
          checkBg: 'bg-[#C68C33]',
          checkColor: 'text-white',
          fillColor: 'white'
        };
      case 'premium':
        return {
          title: 'Enterprise Scale',
          subtitle: 'Limitless growth',
          features: ['White Labeling', 'Web Integration', 'CRM Sync'],
          icon: (
            <div className="w-5 h-5 text-white">
              <BusinessOutline1 />
            </div>
          ),
          buttonText: 'Contact Sales',
          headerGradient: 'bg-gradient-to-br from-blue-600 to-cyan-600',
          borderColor: 'border-blue-100 dark:border-blue-900',
          buttonGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
          iconBg: 'bg-white/20',
          checkBg: 'bg-blue-600',
          checkColor: 'text-white',
          fillColor: 'white'
        };
      case 'enterprise':
        return {
          title: 'Expand Ecosystem',
          subtitle: 'Connect everything',
          features: ['Slack', 'Telegram', 'WeChat', 'Custom API'],
          icon: (
            <div className="w-5 h-5 text-white">
              <LucideWarehouse />
            </div>
          ),
          buttonText: 'Explore Apps',
          headerGradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
          borderColor: 'border-emerald-100 dark:border-emerald-900',
          buttonGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
          iconBg: 'bg-white/20',
          checkBg: 'bg-emerald-500',
          checkColor: 'text-white',
          fillColor: 'white'
        };
      default:
        return null;
    }
  };

  const upgradeInfo = getUpgradeInfo(tier);
  
  return (
    <div className={`relative dashboard-button-group hover:scale-105 transition-all duration-200 ${className}`}>
      {/* Logo button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border border-gray-200 dark:border-gray-800 relative overflow-hidden"
        style={{
          boxShadow: isClicked 
            ? '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.2)' 
            : undefined
        }}
      >
        {isClicked && (
          <>
            <div 
              className="absolute inset-0 rounded-full animate-ripple"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                animation: 'ripple 0.6s ease-out'
              }}
            />
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(147, 197, 253, 0.5), transparent)',
                animation: 'rotate-gradient 0.6s linear'
              }}
            />
          </>
        )}
        
        {businessLogoUrl ? (
          <ProtectedImg 
            src={businessLogoUrl} 
            alt="Business Logo"
            className="w-10 h-10 relative z-10 object-contain rounded"
          />
        ) : (
          <AcesLogo className="w-10 h-10 relative z-10" isHovered={isHovered} isClicked={isClicked} />
        )}
      </button>
      
      {/* Tier Indicator attached to button */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10">
        <HoverCard openDelay={0} closeDelay={100}>
          <HoverCardTrigger asChild>
            <TriggerButton
              onClick={handleTierClick}
              className="transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <TierIndicator tier={tier} className="shadow-sm" />
            </TriggerButton>
          </HoverCardTrigger>
          <HoverCardContent side="right" align="start" sideOffset={15} className={`w-64 p-0 overflow-hidden border ${upgradeInfo?.borderColor || 'border-gray-200'} shadow-2xl rounded-xl z-[100]`}>
            {upgradeInfo && (
              <div className="flex flex-col bg-white dark:bg-gray-900">
                {/* Header */}
                <div className={`px-4 py-3 ${upgradeInfo.headerGradient} relative overflow-hidden flex items-center justify-between`}>
                  {/* Decorative shine effect */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                  
                  <div className="relative z-10">
                    <h4 className="font-bold text-sm text-white drop-shadow-sm">{upgradeInfo.title}</h4>
                    <p className="text-white/90 text-[10px] font-bold mt-0.5 uppercase tracking-wide opacity-90">{upgradeInfo.subtitle}</p>
                  </div>
                  <div className={`${upgradeInfo.iconBg} p-1.5 rounded-lg backdrop-blur-md shadow-inner border border-white/20 relative z-10`}>
                    {upgradeInfo.icon}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3 mb-5">
                    {upgradeInfo.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 group">
                        <div className={`w-4 h-4 rounded-full ${upgradeInfo.checkBg} flex items-center justify-center flex-shrink-0`}>
                          <div className={`w-2.5 h-2.5 flex items-center justify-center ${upgradeInfo.checkColor}`} style={{ ['--fill-0' as any]: 'currentColor' }}>
                            <Check />
                          </div>
                        </div>
                        <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className={`w-full py-2.5 px-3 ${upgradeInfo.buttonGradient} text-white text-xs font-bold rounded-full shadow-md transform transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTierClick();
                    }}
                  >
                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                    
                    <span className="relative z-10">{upgradeInfo.buttonText}</span>
                    <div className="w-3.5 h-3.5 relative z-10 transition-transform group-hover:translate-x-1 flex items-center justify-center" style={{ ['--fill-0' as any]: 'white' }}>
                      <CilArrowRight />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      
      {/* Add keyframe animations to global scope via style tag */}
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes rotate-gradient {
          0% {
            transform: rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
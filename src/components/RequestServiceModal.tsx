import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Check, Info, Globe, Facebook, Mail, MoreHorizontal, Wrench, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

// Assets
import integrationSpecialistImage from 'figma:asset/c79630a57397a42d08372eba673fd92e28c4bf5f.png';
import instagramLogo from 'figma:asset/a292b19e84a1f879f651078f73cedfa89b695975.png';
import whatsappIcon from 'figma:asset/6e1f7ff7a0d2aa0a313a90da33aa60053d91ea17.png';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

type ServiceType = 'WhatsApp' | 'Website' | 'Instagram' | 'Facebook' | 'Email' | 'Other';

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({
  isOpen,
  onClose,
  userEmail = '',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [otherPlatform, setOtherPlatform] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customIntegrationDesc, setCustomIntegrationDesc] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  // Reset state when closing or opening
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCustomIntegrationDesc('');
    }
  }, [isOpen]);

  const handleSubmitCustomQuote = () => {
    if (!customIntegrationDesc.trim()) {
      toast.error('Please describe the custom integration you need');
      return;
    }
    setIsSubmittingCustom(true);
    setTimeout(() => {
      setIsSubmittingCustom(false);
      toast.success('Quote request sent! We\'ll get back to you at your registered email.');
      setCustomIntegrationDesc('');
      setStep(1);
      onClose();
    }, 1500);
  };

  const handleNext = () => {
    if (!selectedService) {
      toast.error('Please select a service');
      return;
    }

    if (selectedService === 'Other' && !otherPlatform.trim()) {
      toast.error('Please enter the platform name');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Request sent successfully!');
      window.open('https://acesai.me/integration-specialists', '_blank');
      onClose();
      // Reset state
      setSelectedService(null);
      setOtherPlatform('');
      setStep(1);
    }, 1500);
  };

  const services: { type: ServiceType; icon: React.ReactNode; containerClass: string }[] = [
    { 
      type: 'WhatsApp', 
      icon: <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6 object-contain" />, 
      containerClass: 'bg-green-500'
    },
    { 
      type: 'Website', 
      icon: <Globe className="w-6 h-6 text-white" />, 
      containerClass: 'bg-blue-500'
    },
    { 
      type: 'Instagram', 
      icon: <img src={instagramLogo} alt="Instagram" className="w-6 h-6 object-contain" />, 
      containerClass: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
    },
    { 
      type: 'Facebook', 
      icon: <Facebook className="w-6 h-6 text-white" />, 
      containerClass: 'bg-blue-600'
    },
    { 
      type: 'Email', 
      icon: <Mail className="w-6 h-6 text-white" />, 
      containerClass: 'bg-blue-400'
    },
    { 
      type: 'Other', 
      icon: <MoreHorizontal className="w-6 h-6 text-white" />, 
      containerClass: 'bg-gray-500'
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md mx-auto" aria-describedby={undefined}>
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="contents"
            >
              <DialogHeader className="pb-3">
                <DialogTitle className="text-center">
                  Request Service Integration
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex flex-wrap justify-center gap-6">
                  {services.map((service) => (
                    <button
                      key={service.type}
                      onClick={() => setSelectedService(service.type)}
                      className="group flex flex-col items-center justify-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <div className={`
                        relative w-14 h-14 rounded-xl ${service.containerClass} 
                        flex items-center justify-center shadow-md transition-transform duration-200
                        ${selectedService === service.type ? 'scale-110 ring-2 ring-offset-2 ring-blue-500' : 'group-hover:scale-105'}
                      `}>
                        {service.icon}
                        
                        {selectedService === service.type && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-medium transition-colors ${
                        selectedService === service.type ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {service.type}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedService === 'Other' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 px-2"
                  >
                    <Label htmlFor="other-platform">Custom Platform Name</Label>
                    <Input
                      id="other-platform"
                      placeholder="Enter your desired Platform for AI Assistance"
                      value={otherPlatform}
                      onChange={(e) => setOtherPlatform(e.target.value)}
                      className="w-full"
                      autoFocus
                    />
                  </motion.div>
                )}
              </div>

              {/* Request Custom Integration CTA */}
              <button
                onClick={() => setStep(3)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Request Custom Integration</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Get a personalized quote for a tailored solution</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>

              <div className="flex justify-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!selectedService || (selectedService === 'Other' && !otherPlatform.trim())}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="contents"
            >
              <DialogHeader className="pb-3">
                <DialogTitle className="text-center">
                  Request AI Integration Specialist Visit
                </DialogTitle>
              </DialogHeader>

              {/* Integration Specialist Image */}
              <div className="w-full overflow-hidden rounded-lg -mt-2 mb-4">
                <ImageWithFallback 
                  src={integrationSpecialistImage}
                  alt="Integration Specialist"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="space-y-4">
                {/* UAE Only Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                        Available in UAE Only
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        This service is currently only available for businesses located in the United Arab Emirates.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">What is a Request Visit?</h4>
                    <span className="text-sm font-semibold italic text-blue-600 dark:text-blue-400">Let us do it for you</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Our AI integration specialist will visit your business location in the UAE to help you:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Set up and configure your {selectedService === 'Other' ? (otherPlatform || 'Custom') : selectedService} integration
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Customize AI responses for your specific business needs</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Train your team on using the platform effectively</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Provide ongoing support and best practices</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 cursor-pointer"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  {isSubmitting ? 'Sending...' : 'Continue to Request'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="contents"
            >
              <DialogHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <DialogTitle>Request Custom Integration</DialogTitle>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200/50 dark:border-indigo-800/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Custom Built Feature</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Need something unique? Describe the feature or integration you'd like built specifically for your business and we'll provide a personalized quote.
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
                    placeholder="e.g., 'I need a custom booking system integrated with my POS software that syncs customer data and sends automated confirmations...'"
                    className="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2 px-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quote will be sent to <span className="font-medium text-gray-700 dark:text-gray-300">{userEmail || 'your registered email'}</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 cursor-pointer"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmitCustomQuote}
                  disabled={isSubmittingCustom || !customIntegrationDesc.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  {isSubmittingCustom ? 'Sending...' : 'Request Quote'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
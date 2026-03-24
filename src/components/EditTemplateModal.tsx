import React, { useState, useEffect, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X, RotateCcw, Bell, Star, MessageCircle, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import LucideSave from '../imports/LucideSave-740-58';
import LucideWandSparkles from '../imports/LucideWandSparkles';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from "sonner";
import { supabase } from '../utils/supabase/client';
import { AutoResizeTextarea } from './AutoResizeTextarea';

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateType: 'reminder' | 'review' | 'followup' | 'payment';
  currentTemplate: string;
  defaultTemplate: string;
  onSave: (template: string) => void;
  companyName: string;
  lineOfBusiness: string;
  userName: string;
  isDarkMode: boolean;
}

const templateConfig = {
  reminder: {
    title: 'Edit Reminder Template',
    subtitle: 'Editing template for reminder messages',
    icon: Bell,
    iconBg: 'bg-blue-500',
  },
  review: {
    title: 'Edit Review Request Template',
    subtitle: 'Editing template for review requests',
    icon: Star,
    iconBg: 'bg-yellow-500',
  },
  followup: {
    title: 'Edit Follow-up Template',
    subtitle: 'Editing template for follow-up messages',
    icon: MessageCircle,
    iconBg: 'bg-green-500',
  },
  payment: {
    title: 'Edit Payment Link Template',
    subtitle: 'Editing template for payment requests',
    icon: CreditCard,
    iconBg: 'bg-purple-500',
  }
};

export const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  isOpen,
  onClose,
  templateType,
  currentTemplate,
  defaultTemplate,
  onSave,
  companyName,
  lineOfBusiness,
  userName,
  isDarkMode
}) => {
  const [editedTemplate, setEditedTemplate] = useState(currentTemplate);
  const [hasChanges, setHasChanges] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const prevIsOpenRef = useRef(isOpen);

  // Update edited template ONLY when modal transitions from closed to open
  useEffect(() => {
    const wasClosedNowOpen = !prevIsOpenRef.current && isOpen;
    
    if (wasClosedNowOpen) {
      // Modal just opened - reset to current template
      setEditedTemplate(currentTemplate);
      setHasChanges(false);
      setAiPrompt('');
      setIsGenerating(false);
    }
    
    prevIsOpenRef.current = isOpen;
  }, [isOpen, currentTemplate]);

  // Track changes
  useEffect(() => {
    setHasChanges(editedTemplate !== currentTemplate);
  }, [editedTemplate, currentTemplate]);

  const handleSave = () => {
    onSave(editedTemplate);
    onClose();
  };

  const handleReset = () => {
    setEditedTemplate(defaultTemplate);
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the AI');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get access token from Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error('Session error:', sessionError);
        toast.error('Authentication error. Please try logging in again.');
        setIsGenerating(false);
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/templates/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            prompt: aiPrompt,
            templateType: templateType,
            companyName: companyName,
            lineOfBusiness: lineOfBusiness
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('AI generation error:', data);
        toast.error(data.error || 'Failed to generate template');
        return;
      }

      if (data.success && data.template) {
        setEditedTemplate(data.template);
        setAiPrompt(''); // Clear the prompt after successful generation
        toast.success('Template generated successfully!');
      } else {
        toast.error('Failed to generate template');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate template');
    } finally {
      setIsGenerating(false);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newTemplate = editedTemplate.substring(0, start) + variable + editedTemplate.substring(end);
      setEditedTemplate(newTemplate);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const config = templateConfig[templateType];
  const IconComponent = config.icon;

  return (
    <DialogPrimitive.Root 
      open={isOpen}
      modal={true}
    >
      <DialogPrimitive.Portal forceMount={isOpen ? undefined : false}>
        <DialogPrimitive.Overlay 
          className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ zIndex: 100000 }}
        />
        <DialogPrimitive.Content 
          className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-3xl max-h-[90vh] w-full overflow-hidden flex flex-col bg-white dark:bg-gray-900 rounded-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 ${
            isGenerating ? 'animate-purple-border-pulse' : ''
          }`}
          style={{ 
            zIndex: 100001,
            boxShadow: isGenerating 
              ? undefined 
              : '0 25px 50px -12px rgb(0 0 0 / 0.25)'
          }}
          onEscapeKeyDown={(e) => {
            if (isGenerating) {
              e.preventDefault();
            }
          }}
          onPointerDownOutside={(e) => {
            if (isGenerating) {
              e.preventDefault();
            }
          }}
        >
          {/* Header with icon and title */}
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogPrimitive.Title className="text-xl text-gray-900 dark:text-gray-100">
                    {config.title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {config.subtitle}
                  </DialogPrimitive.Description>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (!isGenerating) {
                    onClose();
                  }
                }}
                disabled={isGenerating}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Message Template Section */}
          <div className="space-y-3">
            <Label htmlFor="template-textarea" className="text-sm text-gray-900 dark:text-white">
              Message Template
            </Label>
            <AutoResizeTextarea
              id="template-textarea"
              value={editedTemplate}
              onChange={setEditedTemplate}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your template message here..."
              minHeight={120}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tip: Use variables like {'{name}'}, {'{company}'}, {'{business}'}, {'{date}'}, {'{yourname}'} to personalize your message
            </p>
          </div>

          {/* AI Generation Section */}
          <div className="space-y-3">
            <Label htmlFor="ai-prompt" className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-4 h-4 text-purple-500">
                <LucideWandSparkles />
              </div>
              Let AI Generate For You
            </Label>
            <div className="flex gap-2">
              <input
                id="ai-prompt"
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerateAI();
                  }
                }}
                className={`flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none ${
                  isGenerating 
                    ? 'border-purple-500 animate-pulse' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                }`}
                placeholder="Describe..."
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating || !aiPrompt.trim()}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4">
                      <LucideWandSparkles />
                    </div>
                    Generate
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI will create a short, conversational WhatsApp-style message based on your description
            </p>
          </div>

          {/* Preview Section */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-900 dark:text-white">
              Preview:
            </Label>
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-5">
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {editedTemplate
                  .replace(/{name}/g, 'John Smith')
                  .replace(/{company}/g, companyName)
                  .replace(/{business}/g, lineOfBusiness)
                  .replace(/{date}/g, new Date().toLocaleDateString())
                  .replace(/{yourname}/g, userName || 'Your Name')
                }
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={() => {
              if (!isGenerating) {
                onClose();
              }
            }}
            disabled={isGenerating}
            className="px-6 py-2.5 text-sm text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <div className="w-4 h-4" style={{ '--stroke-0': 'white' } as React.CSSProperties}>
              <LucideSave />
            </div>
            Save Template
          </button>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

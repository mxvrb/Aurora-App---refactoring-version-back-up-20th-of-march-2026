import React, { useState } from "react";
import {
  UserPlus,
  Edit,
  Sparkles,
  RotateCcw,
  Loader2,
  WandSparkles,
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  generateWithOpenAI,
  getBusinessContext,
} from "../utils/openai";
import { motion } from "motion/react";
import { MagicalLoadingText } from "./MagicalLoadingText";
import LucideBrain from "../imports/LucideBrain";
interface EnrollClientFormProps {
  enrollClientName: string;
  setEnrollClientName: (value: string) => void;
  enrollPhoneNumber: string;
  setEnrollPhoneNumber: (value: string) => void;
  enrollMessageMode: "manual" | "ai";
  setEnrollMessageMode: (value: "manual" | "ai") => void;
  enrollGoal: string;
  setEnrollGoal: (value: string) => void;
  enrollManualMessage: string;
  setEnrollManualMessage: (value: string) => void;
  enrollAIMessage: string;
  setEnrollAIMessage: (value: string) => void;
  isGeneratingEnrollMessage: boolean;
  setIsGeneratingEnrollMessage: (value: boolean) => void;
  mockCustomerChats: any[];
  setMockCustomerChats: (chats: any[]) => void;
  setIsEnrollMode: (value: boolean) => void;
  setSelectedCustomerChat: (id: number | null) => void;
}

export function EnrollClientForm({
  enrollClientName,
  setEnrollClientName,
  enrollPhoneNumber,
  setEnrollPhoneNumber,
  enrollMessageMode,
  setEnrollMessageMode,
  enrollGoal,
  setEnrollGoal,
  enrollManualMessage,
  setEnrollManualMessage,
  enrollAIMessage,
  setEnrollAIMessage,
  isGeneratingEnrollMessage,
  setIsGeneratingEnrollMessage,
  mockCustomerChats,
  setMockCustomerChats,
  setIsEnrollMode,
  setSelectedCustomerChat,
}: EnrollClientFormProps) {
  return (
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
              Add a new WhatsApp customer to start automated AI
              conversations
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Client Name Input */}
        <div className="space-y-2">
          <Label
            htmlFor="enroll-name"
            className="text-gray-900 dark:text-gray-100"
          >
            Client Name *
          </Label>
          <Input
            id="enroll-name"
            type="text"
            placeholder="e.g., Sarah Johnson"
            value={enrollClientName}
            onChange={(e) =>
              setEnrollClientName(e.target.value)
            }
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label
            htmlFor="enroll-phone"
            className="text-gray-900 dark:text-gray-100"
          >
            WhatsApp Phone Number *
          </Label>
          <Input
            id="enroll-phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={enrollPhoneNumber}
            onChange={(e) =>
              setEnrollPhoneNumber(e.target.value)
            }
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Include country code (e.g., +1 for US)
          </p>
        </div>

        {/* Goal Input (Optional) */}
        <div className="space-y-2">
          <Label
            htmlFor="enroll-goal"
            className="text-gray-900 dark:text-gray-100 flex items-center space-x-2"
          >
            <span>Conversation Goal</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              (Optional)
            </span>
          </Label>
          <textarea
            id="enroll-goal"
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
              htmlFor="enroll-message"
              className="text-gray-900 dark:text-gray-100"
            >
              Your Message *
            </Label>
          </div>
          <div>
            <textarea
              id="enroll-message"
              rows={5}
              placeholder="Hi! We noticed you get your nails done regularly. We'd love to have you visit our salon..."
              value={enrollManualMessage}
              onChange={(e) =>
                setEnrollManualMessage(e.target.value)
              }
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div
              onClick={async () => {
                if (isGeneratingEnrollMessage) return;
                setIsGeneratingEnrollMessage(true);
                toast.info('Generating message...');
                try {
                  const { companyName, lineOfBusiness } =
                    getBusinessContext();
                  const systemPrompt = `You are a friendly business outreach assistant. Write a short, personalized first message to a new customer. Keep it under 3 sentences. Warm and welcoming.`;
                  const goalText =
                    enrollGoal ||
                    "have a friendly conversation";
                  const userPrompt = `Write a first outreach message${enrollClientName ? ` to ${enrollClientName}` : " to a customer"}${companyName ? ` from ${companyName}` : ""}${lineOfBusiness ? ` (${lineOfBusiness})` : ""}. Goal: ${goalText}.`;
                  const generated = await generateWithOpenAI(
                    systemPrompt,
                    userPrompt,
                  );
                  setEnrollManualMessage(generated);
                  toast.success("AI message generated!");
                } catch (error: any) {
                  toast.error(
                    error.message ||
                      "Failed to generate message",
                  );
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
              if (mockCustomerChats.length > 0) {
                setSelectedCustomerChat(
                  mockCustomerChats[0].id,
                );
              }
            }}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
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
                toast.error(
                  "Please write a message or use AI to generate one",
                );
                return;
              }

              // Create new customer chat
              const newCustomer = {
                id: Date.now(),
                name: enrollClientName,
                phone: enrollPhoneNumber,
                lastMessage: enrollManualMessage,
                time: "Just now",
                unreadCount: 0,
                needsAttention: false,
                isHoveringNeedsResponse: false,
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

              setMockCustomerChats([
                newCustomer,
                ...mockCustomerChats,
              ]);

              // Select the newly enrolled customer's chat FIRST
              setSelectedCustomerChat(newCustomer.id);

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
                  description:
                    "Initial message sent via WhatsApp",
                },
              );
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Enroll Customer
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
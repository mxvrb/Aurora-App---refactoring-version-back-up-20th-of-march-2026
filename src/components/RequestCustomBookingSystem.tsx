import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Send, CheckCircle, Info, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

const supabaseUrl = `https://${projectId}.supabase.co`;

interface RequestCustomBookingSystemProps {
  onBack: () => void;
  userEmail?: string;
}

export function RequestCustomBookingSystem({ onBack, userEmail = 'user@example.com' }: RequestCustomBookingSystemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f7de5a4/mcp-request/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasRequest) {
            setRequestSent(true);
            // Also set localStorage for filter completion tracking
            localStorage.setItem('acesai_mcp_request_submitted', 'true');

            // Dispatch event to trigger filter UI update
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
                detail: { key: 'acesai_mcp_request_submitted', value: 'true' }
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error checking request status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkRequestStatus();
  }, []);

  const handleRequestQuote = () => {
    setIsModalOpen(true);
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRequirements(value);
    if (validationError && value.length >= 20) {
      setValidationError('');
    }
  };

  const submitRequest = async () => {
    if (requirements.length < 20) {
      setValidationError('Please provide at least 20 characters to explain your requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No session');
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f7de5a4/mcp-request/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ requirements })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setRequestSent(true);
        // Save to localStorage for filter completion tracking
        localStorage.setItem('acesai_mcp_request_submitted', 'true');

        // Dispatch event to trigger filter UI update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
            detail: { key: 'acesai_mcp_request_submitted', value: 'true' }
          }));
        }
      } else {
        console.error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelRequest = async () => {
    setIsCancelling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No session');
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f7de5a4/mcp-request/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        setRequestSent(false);
        setRequirements('');
        setShowCancelDialog(false);
        // Remove from localStorage for filter completion tracking
        localStorage.removeItem('acesai_mcp_request_submitted');

        // Dispatch event to trigger filter UI update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
            detail: { key: 'acesai_mcp_request_submitted' }
          }));
        }
      } else {
        console.error('Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" style={{ willChange: 'transform' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Floating back button */}
      <div
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all shadow-lg cursor-pointer"
        onClick={onBack}
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Request Custom Booking System (MCP)</span>
      </div>

      <div className="px-6 pb-6">
        {requestSent ? (
          <div className="flex flex-col items-center">
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 w-full mb-6">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800/40 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Request Sent!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                  Your request has been successfully submitted. Please expect a reply with a quote within 5 business days.
                </p>
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">We will contact you at:</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{userEmail}</p>
                </div>
                <Button onClick={onBack} variant="outline" className="min-w-[120px]">
                  Back to Menu
                </Button>
              </CardContent>
            </Card>

            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20 transition-all font-medium"
            >
              Cancel Request
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Custom AI Booking Integration</h2>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 mb-8">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  What is an MCP?
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  A <strong>Model Context Protocol (MCP)</strong> is a standardized way for AI assistants to interact with your specific data and tools.
                  By creating a custom MCP for your business, we can enable Aces AI to directly check your unique booking availability,
                  create reservations, and manage your specific calendar system—no matter what software you use.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Tailored to You</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We build a custom integration that matches your exact business rules, table/resource management, and scheduling complexities.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Seamless AI Handover</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The AI will be able to check real-time availability and confirm bookings instantly without manual intervention.
                  </p>
                </div>
              </div>

              <div className="text-center bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">Ready to upgrade your booking experience?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  Let Aces create a custom booking system for you that will integrate seamlessly with our AI software.
                </p>
                <Button
                  onClick={handleRequestQuote}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Request a Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Custom Booking System Quote</DialogTitle>
            <DialogDescription>
              Tell us about your current system and what you need the AI to do.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requirements">System Requirements & Details</Label>
              <Textarea
                id="requirements"
                placeholder="E.g., We use a custom Excel sheet, or a specific legacy software. We need the AI to check availability based on..."
                className={`h-32 resize-none ${validationError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={requirements}
                onChange={handleRequirementsChange}
              />
              {validationError && (
                <p className="text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                  {validationError}
                </p>
              )}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200">
              We'll send the quote to <strong>{userEmail}</strong>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={submitRequest} disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your request for a custom booking system quote. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Request</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                cancelRequest();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Request'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
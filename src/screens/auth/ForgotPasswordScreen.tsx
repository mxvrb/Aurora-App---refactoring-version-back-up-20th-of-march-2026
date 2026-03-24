import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Mail } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

export const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill email if passed from login screen
    if (location.state?.email) {
      setForgotPasswordEmail(location.state.email);
    }
  }, [location.state]);

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setForgotPasswordSuccess(true);
    } catch (error: any) {
      console.log('Password reset error:', error.message);
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/login');
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-medium">
            {forgotPasswordSuccess ? 'Check Your Email' : 'Reset Password'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {forgotPasswordSuccess 
              ? 'We\'ve sent you a password reset link if an account with that email exists.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </DialogDescription>
        </DialogHeader>

        {forgotPasswordSuccess ? (
          <div className="space-y-4 px-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-gray-900 dark:text-gray-100">
                If an account exists for <strong>{forgotPasswordEmail}</strong>, you will receive a password reset link shortly.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Check your email and click the link to reset your password. The link will expire in 24 hours.
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-2">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSendPasswordReset} className="space-y-4">
              <div>
                <Label htmlFor="resetEmail">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 cursor-pointer"
                  disabled={forgotPasswordLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  disabled={forgotPasswordLoading || !forgotPasswordEmail.trim()}
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

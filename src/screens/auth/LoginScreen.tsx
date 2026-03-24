import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import CustomButton from '../../components/Button';
import { AcesLogo } from '../../components/AcesLogo';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

// Local LoadingDots component (matches App.tsx implementation)
const LoadingDots = ({ text = "Logging in" }: { text?: string }) => {
  const [dotCount, setDotCount] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => prev === 3 ? 1 : prev + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount);

  return (
    <span className="inline-block min-w-[60px] text-left">
      {text}{dots}
    </span>
  );
};

interface LoginScreenProps {
  onLoginSuccess: (accessToken: string, userEmail: string, isFirstTime: boolean) => void;
  setShowTermsModal: (show: boolean) => void;
  setShowPrivacyModal: (show: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  setShowTermsModal,
  setShowPrivacyModal,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate input
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      if (signInData.session?.access_token) {
        onLoginSuccess(
          signInData.session.access_token,
          signInData.user?.email || email,
          false
        );
      }
    } catch (err: any) {
      console.log('Login error:', err.message);
      setError(err.message || 'Failed to sign in');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', { state: { email } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Company Name */}
        <div className="relative flex justify-center mb-8">
          {/* Oval Shadowed Background */}
          <div className="absolute w-full max-w-2xl h-[92px] -top-[10px] rounded-full bg-white shadow-xl shadow-blue-500/30 flex items-center justify-center">
            {/* This div is for the oval background and shadow */}
          </div>
          {/* Logo content */}
          <div className="relative z-10 flex items-center space-x-2 bg-transparent p-2 rounded-full">
            <AcesLogo
              className="w-[72px] h-[72px]"
            />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">Aces AI</span>
          </div>
        </div>
      </div>

      {/* Login Card Container with LED Effect */}
      <div className="relative w-full max-w-md">
        {/* LED Glow Background */}
        <div className="absolute -inset-3 rounded-[24px] bg-gradient-to-br from-cyan-400/30 via-blue-500/25 to-teal-400/30 dark:from-cyan-400/20 dark:via-blue-500/20 dark:to-teal-400/20 blur-xl animate-pulse pointer-events-none" style={{ zIndex: 0 }} />
        <div className="absolute -inset-1.5 rounded-[20px] bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-teal-400/20 dark:from-cyan-400/15 dark:via-blue-500/12 dark:to-teal-400/15 blur-lg pointer-events-none" style={{ zIndex: 0 }} />
        
        <Card className="relative overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.25),0_0_60px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_rgba(56,189,248,0.15),0_0_60px_rgba(59,130,246,0.1)] border-2 border-cyan-400/60 dark:border-cyan-400/40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl z-10 w-full rounded-2xl">
        <CardHeader className="text-center pb-1">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-bold">
            Welcome back!
          </h2>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-100 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => console.log('Google login clicked - intentionally disabled')}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-gray-400 w-4 h-4" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-gray-400 w-4 h-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  required
                />
                <CustomButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <Eye className="w-[17px] h-[17px]" /> : <EyeOff className="w-[17px] h-[17px]" />}
                </CustomButton>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              type="submit"
              className={`w-full h-12 text-white font-bold font-normal transition-colors cursor-pointer ${(isLoading || error)
                ? 'bg-blue-600/50 hover:bg-blue-600/50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
              disabled={isLoading || !!error}
            >
              {isLoading ? <LoadingDots text="Signing in" /> : 'Continue'}
            </Button>

            {/* Terms and Privacy */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              By continuing, you agree to our{' '}
              <CustomButton
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="underline text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                Terms of Service
              </CustomButton>
              {' '}and{' '}
              <CustomButton
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="underline text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                Privacy Policy
              </CustomButton>
              .
            </div>

            {/* Sign Up Toggle */}
            <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <CustomButton
                type="button"
                onClick={() => navigate('/signup')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm cursor-pointer"
              >
                Sign up
              </CustomButton>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <CustomButton
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm cursor-pointer"
            >
              Forgot password?
            </CustomButton>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

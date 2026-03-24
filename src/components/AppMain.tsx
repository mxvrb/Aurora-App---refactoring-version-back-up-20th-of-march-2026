import React, { useState, useEffect } from 'react';
import { Toaster } from './ui/sonner';
import { LoginScreen } from './LoginScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { OnboardingScreens } from './OnboardingScreens';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { AcesLogo } from './AcesLogo';
import { OfflineStorageManager } from '../utils/offlineStorage';

// Import images
import image_e45e3ee4eba71949f29d76d45845399fdf3cc9ec from 'figma:asset/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png';

type AuthStep = 'login' | 'nameEntry' | 'companyEntry' | 'businessEntry' | 'welcome' | 'dashboard' | 'whatsapp' | 'analytics' | 'instagram' | 'website' | 'facebook' | 'mail';

const offlineStorage = OfflineStorageManager.getInstance();

// Comprehensive list of business categories
const BUSINESS_CATEGORIES = [
  "3D Printing & Prototyping Services",
  "Accounting & Auditing Firms",
  "Advertising & Marketing Agencies",
  "AI consultancy firms",
  "Air Charter & Private Jet Brokerage",
  "Alternative Medicine & Acupuncture Clinics",
  "Antique & Vintage Dealers",
  "Art Galleries & Auction Houses",
  "Auto Repair & Maintenance Workshops",
  "Bakery & Patisserie Businesses",
  "Bed & Breakfast & Eco-lodge Operators",
  "Bookstores",
  "Boutique Hotel & Hospitality Services",
  "Business Consultancy Services",
  "Car Rental",
  "Catering & Food Service Businesses",
  "Childcare & Daycare Centers",
  "Construction Company",
  "Cooking Schools & Culinary Academies",
  "Cybersecurity Service Providers",
  "Dance Studios & Academies",
  "Dermatology & Cosmetic Clinics",
  "Digital Marketing & SEO Agencies",
  "Driving Schools",
  "E-commerce Store Operators",
  "Elderly & Assisted Living Services",
  "Event Ticketing & Festival Organizers",
  "Fashion Shows & Model Management Firms",
  "Female Hair Salon",
  "Film & Media Production Houses",
  "Fitness & Sports Training Centers",
  "Florists & Floral Arrangement Services",
  "Food Trucks & Mobile Food Vendors",
  "Funeral & Crematorium Services",
  "Gymnasiums",
  "Handyman",
  "Health & Safety Training Providers",
  "High-end Appliance Retailers",
  "Hospitals",
  "Hotel & Resort Operators",
  "Housekeeping",
  "HR Outsourcing & Payroll Services",
  "Ice Cream & Dessert Shops",
  "Interior Design & Home Décor Studios",
  "IT & Tech Consultancy Services",
  "Jewelry repair shops",
  "Language & Exam Training Centers",
  "Law Firms & Legal Consultants",
  "Logistics & Courier Services",
  "Luxury Car Detailing Services",
  "Luxury Fashion Boutiques",
  "Male Barber Shop",
  "Massage Centre",
  "Medical Equipment Suppliers",
  "Music & Performing Arts Schools",
  "Nail & Beauty Salon",
  "Nutritional Supplement Retailers",
  "Optical retail stores",
  "Organic & Health Food Stores",
  "Pest Control Companies",
  "Photography & Videography Services",
  "Physiotherapy & Rehabilitation Centers",
  "Private School",
  "Real Estate",
  "Recruitment & Staffing Agencies",
  "Restaurants",
  "Specialty Coffee Shops & Cafés",
  "Sports & Leisure Equipment Retail & Rental",
  "Travel Agencies & Tour Operators",
  "Veterinary & Pet Care Services",
  "Wedding & Event Planning",
  "Yoga & Meditation Studios",
  "Other..."
];

export const AppMain: React.FC = () => {
  // Core state
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [lineOfBusiness, setLineOfBusiness] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [canSkipWelcome, setCanSkipWelcome] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Business selection states
  const [businessSelectOpen, setBusinessSelectOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showCustomBusiness, setShowCustomBusiness] = useState(false);
  const [customBusiness, setCustomBusiness] = useState('');
  
  const mountedRef = React.useRef(true);
  const activeTimeouts = React.useRef<NodeJS.Timeout[]>([]);

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      activeTimeouts.current.forEach(timeout => clearTimeout(timeout));
      mountedRef.current = false;
    };
  }, []);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!projectId || !publicAnonKey) {
          setError('System configuration error. Please contact support.');
          return;
        }
        
        await checkExistingSession();
      } catch (error) {
        console.log('App initialization error:', error);
        setError('Failed to initialize app. Please refresh the page.');
      } finally {
        setTimeout(() => {
          if (mountedRef.current) {
            setIsInitializing(false);
          }
        }, 500);
      }
    };
    
    initializeApp();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log('Session check error:', error.message);
        return;
      }
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
        if (session.user?.email) {
          setEmail(session.user.email);
          offlineStorage.setScope(session.user.email);
        }
        
        // For now, just go to dashboard if we have a session
        setIsFirstTimeUser(false);
        setCanSkipWelcome(true);
        setCurrentStep('dashboard');
      }
    } catch (error: any) {
      console.log('Error checking existing session:', error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
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
          // Try to create new user
          try {
            const url = `https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/auth/signup`;
            const signupResponse = await fetch(url, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            if (signupResponse.ok) {
              // New user created, now sign them in
              const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (newSignInError) throw new Error(newSignInError.message);

              if (newSignInData.session?.access_token) {
                setAccessToken(newSignInData.session.access_token);
                if (newSignInData.user?.email) {
                  offlineStorage.setScope(newSignInData.user.email);
                }
                setIsFirstTimeUser(true);
                setCurrentStep('nameEntry');
              }
            } else {
              setError('Invalid password. Please check your password and try again.');
            }
          } catch (fetchError) {
            setError('Invalid email or password. Please check your credentials and try again.');
          }
        } else {
          throw new Error(signInError.message);
        }
      } else {
        // Successful sign in
        if (signInData.session?.access_token) {
          setAccessToken(signInData.session.access_token);
          if (signInData.user?.email) {
            offlineStorage.setScope(signInData.user.email);
          }
          setIsFirstTimeUser(false);
          setCanSkipWelcome(true);
          setCurrentStep('dashboard');
        }
      }
    } catch (error: any) {
      console.log('Login error:', error.message);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || isAnimating) return;
    
    setIsLoading(true);
    setIsAnimating(true);
    
    // Save locally
    const userData = offlineStorage.getUserData() || {};
    userData.userName = userName.trim();
    offlineStorage.saveUserData(userData);
    
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setCurrentStep('companyEntry');
        setIsAnimating(false);
        setIsLoading(false);
      }
    }, 50);
    activeTimeouts.current.push(timer);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || isAnimating) return;
    
    setIsLoading(true);
    setIsAnimating(true);
    
    // Save locally
    const userData = offlineStorage.getUserData() || {};
    userData.companyName = companyName.trim();
    offlineStorage.saveUserData(userData);
    
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setCurrentStep('businessEntry');
        setIsAnimating(false);
        setIsLoading(false);
      }
    }, 50);
    activeTimeouts.current.push(timer);
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const businessToSubmit = showCustomBusiness ? customBusiness : lineOfBusiness;
    if (!businessToSubmit.trim() || isAnimating) return;
    
    setIsLoading(true);
    setIsAnimating(true);
    
    // Save locally
    const userData = offlineStorage.getUserData() || {};
    userData.companyName = companyName.trim();
    userData.lineOfBusiness = businessToSubmit.trim();
    offlineStorage.saveUserData(userData);
    setLineOfBusiness(businessToSubmit.trim());
    
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setCurrentStep('welcome');
        setIsAnimating(false);
        setIsLoading(false);
      }
    }, 50);
    activeTimeouts.current.push(timer);
  };

  const handleWelcomeClick = () => {
    if (!isFirstTimeUser && canSkipWelcome) {
      setCurrentStep('dashboard');
      return;
    }
    
    if (isFirstTimeUser) {
      setCurrentStep('dashboard');
    }
  };

  // Function to highlight matching text
  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-blue-100 text-blue-600 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  // Loading screen
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center">
            <AcesLogo 
              className="w-16 h-16"
              style={{ animation: 'fadeInOut 2s ease-in-out infinite' }}
            />
          </div>
          {error && (
            <div className="mt-8 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm underline"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
        <style>
          {`
            @keyframes fadeInOut {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  // Login Screen
  if (currentStep === 'login') {
    return (
      <>
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          isLoading={isLoading}
          onLogin={handleLogin}
          logoSrc={image_e45e3ee4eba71949f29d76d45845399fdf3cc9ec}
        />
        <Toaster />
      </>
    );
  }

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <WelcomeScreen
        userName={userName}
        isFirstTimeUser={isFirstTimeUser}
        canSkipWelcome={canSkipWelcome}
        onWelcomeClick={handleWelcomeClick}
      />
    );
  }

  // Onboarding Screens
  if (['nameEntry', 'companyEntry', 'businessEntry'].includes(currentStep)) {
    return (
      <OnboardingScreens
        currentStep={currentStep as 'nameEntry' | 'companyEntry' | 'businessEntry'}
        userName={userName}
        setUserName={setUserName}
        companyName={companyName}
        setCompanyName={setCompanyName}
        lineOfBusiness={lineOfBusiness}
        setLineOfBusiness={setLineOfBusiness}
        showCustomBusiness={showCustomBusiness}
        setShowCustomBusiness={setShowCustomBusiness}
        customBusiness={customBusiness}
        setCustomBusiness={setCustomBusiness}
        businessSelectOpen={businessSelectOpen}
        setBusinessSelectOpen={setBusinessSelectOpen}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isLoading={isLoading}
        isAnimating={isAnimating}
        error={error}
        logoSrc={image_e45e3ee4eba71949f29d76d45845399fdf3cc9ec}
        businessCategories={BUSINESS_CATEGORIES}
        onNameSubmit={handleNameSubmit}
        onCompanySubmit={handleCompanySubmit}
        onBusinessSubmit={handleBusinessSubmit}
        highlightMatch={highlightMatch}
      />
    );
  }

  // Dashboard placeholder
  if (currentStep === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-4">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome, {userName}!</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Full dashboard implementation would go here...
          </p>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-gray-900 mb-4">Loading...</h1>
        <p className="text-gray-600">If this persists, please refresh the page.</p>
      </div>
    </div>
  );
};
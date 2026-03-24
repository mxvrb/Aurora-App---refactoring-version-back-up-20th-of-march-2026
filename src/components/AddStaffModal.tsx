import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { User, Calendar, Award, FileText, Shield, Clock, AlertTriangle, X, ChevronsUpDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

// Comprehensive timezone data with major cities worldwide
const timezones = [
  // Americas - West to East
  { offset: -10, value: 'Pacific/Honolulu', city: 'Honolulu', country: 'USA', abbr: 'HST', aliases: 'hawaii hi' },
  { offset: -9, value: 'America/Anchorage', city: 'Anchorage', country: 'USA', abbr: 'AKST', aliases: 'alaska ak' },
  { offset: -8, value: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', abbr: 'PT', aliases: 'california ca la hollywood' },
  { offset: -8, value: 'America/Los_Angeles', city: 'San Francisco', country: 'USA', abbr: 'PT', aliases: 'california ca sf bay area silicon valley' },
  { offset: -8, value: 'America/Los_Angeles', city: 'Seattle', country: 'USA', abbr: 'PT', aliases: 'washington wa' },
  { offset: -8, value: 'America/Los_Angeles', city: 'San Diego', country: 'USA', abbr: 'PT', aliases: 'california ca' },
  { offset: -8, value: 'America/Vancouver', city: 'Vancouver', country: 'Canada', abbr: 'PT', aliases: 'british columbia bc' },
  { offset: -7, value: 'America/Denver', city: 'Denver', country: 'USA', abbr: 'MT', aliases: 'colorado co mountain' },
  { offset: -7, value: 'America/Phoenix', city: 'Phoenix', country: 'USA', abbr: 'MST', aliases: 'arizona az' },
  { offset: -7, value: 'America/Edmonton', city: 'Calgary', country: 'Canada', abbr: 'MT', aliases: 'alberta ab canada' },
  { offset: -6, value: 'America/Chicago', city: 'Chicago', country: 'USA', abbr: 'CT', aliases: 'illinois il central' },
  { offset: -6, value: 'America/Chicago', city: 'Dallas', country: 'USA', abbr: 'CT', aliases: 'texas tx' },
  { offset: -6, value: 'America/Chicago', city: 'Houston', country: 'USA', abbr: 'CT', aliases: 'texas tx' },
  { offset: -6, value: 'America/Chicago', city: 'Austin', country: 'USA', abbr: 'CT', aliases: 'texas tx' },
  { offset: -6, value: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico', abbr: 'CST', aliases: 'cdmx mexico' },
  { offset: -5, value: 'America/New_York', city: 'New York', country: 'USA', abbr: 'ET', aliases: 'ny nyc manhattan eastern' },
  { offset: -5, value: 'America/New_York', city: 'Boston', country: 'USA', abbr: 'ET', aliases: 'massachusetts ma' },
  { offset: -5, value: 'America/New_York', city: 'Miami', country: 'USA', abbr: 'ET', aliases: 'florida fl' },
  { offset: -5, value: 'America/New_York', city: 'Atlanta', country: 'USA', abbr: 'ET', aliases: 'georgia ga' },
  { offset: -5, value: 'America/New_York', city: 'Washington DC', country: 'USA', abbr: 'ET', aliases: 'dc capitol' },
  { offset: -5, value: 'America/Toronto', city: 'Toronto', country: 'Canada', abbr: 'ET', aliases: 'ontario on canada' },
  { offset: -5, value: 'America/Havana', city: 'Havana', country: 'Cuba', abbr: 'CST', aliases: 'cuba' },
  { offset: -5, value: 'America/Bogota', city: 'Bogotá', country: 'Colombia', abbr: 'COT', aliases: 'colombia bogota' },
  { offset: -5, value: 'America/Lima', city: 'Lima', country: 'Peru', abbr: 'PET', aliases: 'peru' },
  { offset: -4, value: 'America/Santiago', city: 'Santiago', country: 'Chile', abbr: 'CLT', aliases: 'chile' },
  { offset: -4, value: 'America/Caracas', city: 'Caracas', country: 'Venezuela', abbr: 'VET', aliases: 'venezuela' },
  { offset: -3, value: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil', abbr: 'BRT', aliases: 'brazil brasil sao paulo' },
  { offset: -3, value: 'America/Sao_Paulo', city: 'Rio de Janeiro', country: 'Brazil', abbr: 'BRT', aliases: 'brazil brasil rio' },
  { offset: -3, value: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina', abbr: 'ART', aliases: 'argentina' },
  { offset: -3, value: 'America/Montevideo', city: 'Montevideo', country: 'Uruguay', abbr: 'UYT', aliases: 'uruguay' },
  
  // Europe & Africa
  { offset: 0, value: 'Europe/London', city: 'London', country: 'UK', abbr: 'GMT', aliases: 'england britain united kingdom gb' },
  { offset: 0, value: 'Europe/Dublin', city: 'Dublin', country: 'Ireland', abbr: 'GMT', aliases: 'ireland irish' },
  { offset: 0, value: 'Europe/Lisbon', city: 'Lisbon', country: 'Portugal', abbr: 'WET', aliases: 'portugal lisboa' },
  { offset: 0, value: 'Africa/Casablanca', city: 'Casablanca', country: 'Morocco', abbr: 'WET', aliases: 'morocco' },
  { offset: 0, value: 'Africa/Accra', city: 'Accra', country: 'Ghana', abbr: 'GMT', aliases: 'ghana' },
  { offset: 1, value: 'Europe/Paris', city: 'Paris', country: 'France', abbr: 'CET', aliases: 'france french' },
  { offset: 1, value: 'Europe/Berlin', city: 'Berlin', country: 'Germany', abbr: 'CET', aliases: 'germany german deutschland' },
  { offset: 1, value: 'Europe/Rome', city: 'Rome', country: 'Italy', abbr: 'CET', aliases: 'italy italian italia' },
  { offset: 1, value: 'Europe/Rome', city: 'Milan', country: 'Italy', abbr: 'CET', aliases: 'italy italian italia milano' },
  { offset: 1, value: 'Europe/Madrid', city: 'Madrid', country: 'Spain', abbr: 'CET', aliases: 'spain spanish' },
  { offset: 1, value: 'Europe/Madrid', city: 'Barcelona', country: 'Spain', abbr: 'CET', aliases: 'spain spanish' },
  { offset: 1, value: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands', abbr: 'CET', aliases: 'netherlands dutch holland' },
  { offset: 1, value: 'Europe/Brussels', city: 'Brussels', country: 'Belgium', abbr: 'CET', aliases: 'belgium belgian' },
  { offset: 1, value: 'Europe/Vienna', city: 'Vienna', country: 'Austria', abbr: 'CET', aliases: 'austria austrian wien' },
  { offset: 1, value: 'Europe/Warsaw', city: 'Warsaw', country: 'Poland', abbr: 'CET', aliases: 'poland polish' },
  { offset: 1, value: 'Europe/Copenhagen', city: 'Copenhagen', country: 'Denmark', abbr: 'CET', aliases: 'denmark danish' },
  { offset: 1, value: 'Europe/Oslo', city: 'Oslo', country: 'Norway', abbr: 'CET', aliases: 'norway norwegian' },
  { offset: 1, value: 'Europe/Zurich', city: 'Zurich', country: 'Switzerland', abbr: 'CET', aliases: 'switzerland swiss' },
  { offset: 1, value: 'Europe/Zurich', city: 'Geneva', country: 'Switzerland', abbr: 'CET', aliases: 'switzerland swiss' },
  { offset: 1, value: 'Europe/Prague', city: 'Prague', country: 'Czech Republic', abbr: 'CET', aliases: 'czech czechia' },
  { offset: 1, value: 'Europe/Budapest', city: 'Budapest', country: 'Hungary', abbr: 'CET', aliases: 'hungary hungarian' },
  { offset: 1, value: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria', abbr: 'WAT', aliases: 'nigeria' },
  { offset: 1, value: 'Africa/Algiers', city: 'Algiers', country: 'Algeria', abbr: 'CET', aliases: 'algeria' },
  { offset: 1, value: 'Africa/Tunis', city: 'Tunis', country: 'Tunisia', abbr: 'CET', aliases: 'tunisia' },
  { offset: 2, value: 'Europe/Stockholm', city: 'Stockholm', country: 'Sweden', abbr: 'CET', aliases: 'sweden swedish' },
  { offset: 2, value: 'Europe/Athens', city: 'Athens', country: 'Greece', abbr: 'EET', aliases: 'greece greek' },
  { offset: 2, value: 'Europe/Helsinki', city: 'Helsinki', country: 'Finland', abbr: 'EET', aliases: 'finland finnish' },
  { offset: 2, value: 'Europe/Istanbul', city: 'Istanbul', country: 'Turkey', abbr: 'TRT', aliases: 'turkey turkish' },
  { offset: 2, value: 'Europe/Bucharest', city: 'Bucharest', country: 'Romania', abbr: 'EET', aliases: 'romania romanian' },
  { offset: 2, value: 'Europe/Kiev', city: 'Kyiv', country: 'Ukraine', abbr: 'EET', aliases: 'ukraine ukrainian kiev' },
  { offset: 2, value: 'Europe/Sofia', city: 'Sofia', country: 'Bulgaria', abbr: 'EET', aliases: 'bulgaria bulgarian' },
  { offset: 2, value: 'Africa/Cairo', city: 'Cairo', country: 'Egypt', abbr: 'EET', aliases: 'egypt egyptian' },
  { offset: 2, value: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa', abbr: 'SAST', aliases: 'south africa' },
  { offset: 2, value: 'Africa/Johannesburg', city: 'Cape Town', country: 'South Africa', abbr: 'SAST', aliases: 'south africa' },
  
  // Middle East
  { offset: 2, value: 'Asia/Jerusalem', city: 'Jerusalem', country: 'Israel', abbr: 'IST', aliases: 'israel' },
  { offset: 2, value: 'Asia/Tel_Aviv', city: 'Tel Aviv', country: 'Israel', abbr: 'IST', aliases: 'israel' },
  { offset: 2, value: 'Asia/Amman', city: 'Amman', country: 'Jordan', abbr: 'EET', aliases: 'jordan' },
  { offset: 2, value: 'Asia/Beirut', city: 'Beirut', country: 'Lebanon', abbr: 'EET', aliases: 'lebanon' },
  { offset: 2, value: 'Asia/Damascus', city: 'Damascus', country: 'Syria', abbr: 'EET', aliases: 'syria' },
  { offset: 2, value: 'Asia/Nicosia', city: 'Nicosia', country: 'Cyprus', abbr: 'EET', aliases: 'cyprus' },
  { offset: 3, value: 'Europe/Moscow', city: 'Moscow', country: 'Russia', abbr: 'MSK', aliases: 'russia russian' },
  { offset: 3, value: 'Europe/Minsk', city: 'Minsk', country: 'Belarus', abbr: 'MSK', aliases: 'belarus' },
  { offset: 3, value: 'Africa/Nairobi', city: 'Nairobi', country: 'Kenya', abbr: 'EAT', aliases: 'kenya' },
  { offset: 3, value: 'Africa/Addis_Ababa', city: 'Addis Ababa', country: 'Ethiopia', abbr: 'EAT', aliases: 'ethiopia' },
  { offset: 3, value: 'Asia/Baghdad', city: 'Baghdad', country: 'Iraq', abbr: 'AST', aliases: 'iraq' },
  { offset: 3, value: 'Asia/Riyadh', city: 'Riyadh', country: 'Saudi Arabia', abbr: 'AST', aliases: 'saudi arabia saudi' },
  { offset: 3, value: 'Asia/Riyadh', city: 'Jeddah', country: 'Saudi Arabia', abbr: 'AST', aliases: 'saudi arabia saudi' },
  { offset: 3, value: 'Asia/Kuwait', city: 'Kuwait City', country: 'Kuwait', abbr: 'AST', aliases: 'kuwait' },
  { offset: 3, value: 'Asia/Qatar', city: 'Doha', country: 'Qatar', abbr: 'AST', aliases: 'qatar' },
  { offset: 3, value: 'Asia/Bahrain', city: 'Manama', country: 'Bahrain', abbr: 'AST', aliases: 'bahrain' },
  { offset: 3, value: 'Asia/Aden', city: 'Aden', country: 'Yemen', abbr: 'AST', aliases: 'yemen' },
  { offset: 3.5, value: 'Asia/Tehran', city: 'Tehran', country: 'Iran', abbr: 'IRST', aliases: 'iran iranian persia' },
  { offset: 4, value: 'Asia/Dubai', city: 'Dubai', country: 'UAE', abbr: 'GST', aliases: 'uae emirates united arab emirates' },
  { offset: 4, value: 'Asia/Dubai', city: 'Abu Dhabi', country: 'UAE', abbr: 'GST', aliases: 'uae emirates united arab emirates' },
  { offset: 4, value: 'Asia/Muscat', city: 'Muscat', country: 'Oman', abbr: 'GST', aliases: 'oman' },
  { offset: 4, value: 'Asia/Baku', city: 'Baku', country: 'Azerbaijan', abbr: 'AZT', aliases: 'azerbaijan' },
  { offset: 4, value: 'Asia/Tbilisi', city: 'Tbilisi', country: 'Georgia', abbr: 'GET', aliases: 'georgia' },
  { offset: 4, value: 'Asia/Yerevan', city: 'Yerevan', country: 'Armenia', abbr: 'AMT', aliases: 'armenia' },
  { offset: 4.5, value: 'Asia/Kabul', city: 'Kabul', country: 'Afghanistan', abbr: 'AFT', aliases: 'afghanistan' },
  
  // Asia
  { offset: 5, value: 'Asia/Karachi', city: 'Karachi', country: 'Pakistan', abbr: 'PKT', aliases: 'pakistan' },
  { offset: 5, value: 'Asia/Tashkent', city: 'Tashkent', country: 'Uzbekistan', abbr: 'UZT', aliases: 'uzbekistan' },
  { offset: 5.5, value: 'Asia/Kolkata', city: 'New Delhi', country: 'India', abbr: 'IST', aliases: 'india indian delhi' },
  { offset: 5.5, value: 'Asia/Kolkata', city: 'Mumbai', country: 'India', abbr: 'IST', aliases: 'india indian bombay' },
  { offset: 5.5, value: 'Asia/Kolkata', city: 'Bangalore', country: 'India', abbr: 'IST', aliases: 'india indian bengaluru' },
  { offset: 5.5, value: 'Asia/Kolkata', city: 'Chennai', country: 'India', abbr: 'IST', aliases: 'india indian madras' },
  { offset: 5.5, value: 'Asia/Kolkata', city: 'Kolkata', country: 'India', abbr: 'IST', aliases: 'india indian calcutta' },
  { offset: 5.5, value: 'Asia/Colombo', city: 'Colombo', country: 'Sri Lanka', abbr: 'IST', aliases: 'sri lanka' },
  { offset: 5.75, value: 'Asia/Kathmandu', city: 'Kathmandu', country: 'Nepal', abbr: 'NPT', aliases: 'nepal' },
  { offset: 6, value: 'Asia/Dhaka', city: 'Dhaka', country: 'Bangladesh', abbr: 'BST', aliases: 'bangladesh' },
  { offset: 6.5, value: 'Asia/Yangon', city: 'Yangon', country: 'Myanmar', abbr: 'MMT', aliases: 'myanmar burma rangoon' },
  { offset: 7, value: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand', abbr: 'ICT', aliases: 'thailand thai' },
  { offset: 7, value: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia', abbr: 'WIB', aliases: 'indonesia indonesian' },
  { offset: 7, value: 'Asia/Ho_Chi_Minh', city: 'Ho Chi Minh City', country: 'Vietnam', abbr: 'ICT', aliases: 'vietnam vietnamese saigon' },
  { offset: 7, value: 'Asia/Ho_Chi_Minh', city: 'Hanoi', country: 'Vietnam', abbr: 'ICT', aliases: 'vietnam vietnamese' },
  { offset: 8, value: 'Asia/Shanghai', city: 'Beijing', country: 'China', abbr: 'CST', aliases: 'china chinese' },
  { offset: 8, value: 'Asia/Shanghai', city: 'Shanghai', country: 'China', abbr: 'CST', aliases: 'china chinese' },
  { offset: 8, value: 'Asia/Chongqing', city: 'Chongqing', country: 'China', abbr: 'CST', aliases: 'china chinese' },
  { offset: 8, value: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'Hong Kong', abbr: 'HKT', aliases: 'hk china' },
  { offset: 8, value: 'Asia/Macau', city: 'Macau', country: 'Macau', abbr: 'CST', aliases: 'macao china' },
  { offset: 8, value: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', abbr: 'SGT', aliases: 'sg' },
  { offset: 8, value: 'Asia/Kuala_Lumpur', city: 'Kuala Lumpur', country: 'Malaysia', abbr: 'MYT', aliases: 'malaysia malaysian kl' },
  { offset: 8, value: 'Asia/Manila', city: 'Manila', country: 'Philippines', abbr: 'PHT', aliases: 'philippines filipino' },
  { offset: 8, value: 'Asia/Taipei', city: 'Taipei', country: 'Taiwan', abbr: 'CST', aliases: 'taiwan taiwanese' },
  { offset: 8, value: 'Australia/Perth', city: 'Perth', country: 'Australia', abbr: 'AWST', aliases: 'australia western australia wa' },
  { offset: 9, value: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', abbr: 'JST', aliases: 'japan japanese' },
  { offset: 9, value: 'Asia/Seoul', city: 'Seoul', country: 'South Korea', abbr: 'KST', aliases: 'korea korean' },
  { offset: 9.5, value: 'Australia/Adelaide', city: 'Adelaide', country: 'Australia', abbr: 'ACST', aliases: 'australia south australia sa' },
  { offset: 9.5, value: 'Australia/Darwin', city: 'Darwin', country: 'Australia', abbr: 'ACST', aliases: 'australia northern territory nt' },
  { offset: 10, value: 'Australia/Sydney', city: 'Sydney', country: 'Australia', abbr: 'AEST', aliases: 'australia new south wales nsw' },
  { offset: 10, value: 'Australia/Melbourne', city: 'Melbourne', country: 'Australia', abbr: 'AEST', aliases: 'australia victoria vic' },
  { offset: 10, value: 'Australia/Brisbane', city: 'Brisbane', country: 'Australia', abbr: 'AEST', aliases: 'australia queensland qld' },
  { offset: 10, value: 'Pacific/Guam', city: 'Guam', country: 'Guam', abbr: 'ChST', aliases: 'guam' },
  { offset: 12, value: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand', abbr: 'NZST', aliases: 'new zealand nz' },
  { offset: 12, value: 'Pacific/Fiji', city: 'Fiji', country: 'Fiji', abbr: 'FJT', aliases: 'fiji' },
];

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  // Availability
  workingDays: string[];
  workHoursStart: string;
  workHoursEnd: string;
  timezone: string;
  // Skills
  skills: string;
  certifications: string;
  // Extra
  notes: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: StaffMember) => void;
  initialData?: StaffMember | null;
  isEditing?: boolean;
}

export function AddStaffModal({ isOpen, onClose, onSave, initialData, isEditing = false }: AddStaffModalProps) {
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('staff');
  
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [workHoursStart, setWorkHoursStart] = useState('09:00');
  const [workHoursEnd, setWorkHoursEnd] = useState('17:00');
  const [timezone, setTimezone] = useState('UTC');
  
  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState('');
  
  const [notes, setNotes] = useState('');

  const [validationAlert, setValidationAlert] = useState('');

  // Timezone search state
  const [timezoneSearchOpen, setTimezoneSearchOpen] = useState(false);
  const [timezoneSearchValue, setTimezoneSearchValue] = useState('');

  // Live timezone clock
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to calculate time in a timezone
  const getTimeForTimezone = (offset: number, timezoneId?: string): string => {
    try {
      if (timezoneId) {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezoneId,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        return formatter.format(currentTime);
      }
    } catch (e) {
      // Fallback to offset calculation if timezone identifier is invalid
    }
    const now = new Date(currentTime);
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (3600000 * offset));
    return localTime.toTimeString().slice(0, 5);
  };

  // Auto-dismiss validation alert after 6 seconds
  useEffect(() => {
    if (validationAlert) {
      const timer = setTimeout(() => setValidationAlert(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [validationAlert]);

  // Reset or Load Data
  React.useEffect(() => {
    if (isOpen) {
      setValidationAlert('');
      if (initialData) {
        setFirstName(initialData.firstName);
        setLastName(initialData.lastName);
        setEmail(initialData.email);
        setPhone(initialData.phone);
        setRole(initialData.role);
        setWorkingDays(initialData.workingDays || []);
        setWorkHoursStart(initialData.workHoursStart || '09:00');
        setWorkHoursEnd(initialData.workHoursEnd || '17:00');
        setTimezone(initialData.timezone || 'UTC');
        setSkills(initialData.skills || '');
        setCertifications(initialData.certifications || '');
        setNotes(initialData.notes || '');
      } else {
        // Reset
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setRole('staff');
        setWorkingDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
        setWorkHoursStart('09:00');
        setWorkHoursEnd('17:00');
        setTimezone('UTC');
        setSkills('');
        setCertifications('');
        setNotes('');
        setValidationAlert('');
      }
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    // Skills & Certifications validation
    if (!skills.trim() || !certifications.trim()) {
      setValidationAlert('Please add your skills, expertise, and certifications before proceeding. This information is required for accurate AI recommendations.');
      return;
    }

    // Basic Validation
    if (!firstName.trim() || !lastName.trim()) return;

    setValidationAlert('');

    const newStaff: StaffMember = {
      id: initialData?.id || crypto.randomUUID(),
      firstName,
      lastName,
      email,
      phone,
      role,
      workingDays,
      workHoursStart,
      workHoursEnd,
      timezone,
      skills,
      certifications,
      notes
    };

    onSave(newStaff);
    onClose();
  };

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details, role, and schedule for this staff member.' 
              : 'Fill in the details below to add a new staff member to your team.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="details" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-100 dark:bg-gray-900 rounded-lg mb-4">
                <TabsTrigger value="details" className="text-xs py-2 flex flex-col items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                    <User className="w-3 h-3" />
                    <span>Details</span>
                </TabsTrigger>
                <TabsTrigger value="role" className="text-xs py-2 flex flex-col items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                    <Shield className="w-3 h-3" />
                    <span>Role</span>
                </TabsTrigger>
                <TabsTrigger value="availability" className="text-xs py-2 flex flex-col items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                    <Calendar className="w-3 h-3" />
                    <span>Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="text-xs py-2 flex flex-col items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                    <Award className="w-3 h-3" />
                    <span>Skills</span>
                </TabsTrigger>
                <TabsTrigger value="extra" className="text-xs py-2 flex flex-col items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md">
                    <FileText className="w-3 h-3" />
                    <span>Extra</span>
                </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="px-1 pb-4">
                    {/* DETAILS TAB */}
                    <TabsContent value="details" className="space-y-4 mt-0">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. Ahmed" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Al Mansouri" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ahmed@example.com" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 123 4567" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700" />
                        </div>
                    </TabsContent>

                    {/* ROLE TAB */}
                    <TabsContent value="role" className="space-y-4 mt-0">
                        <div className="space-y-2">
                            <Label htmlFor="role">Allocate Role</Label>
                            <Input 
                                id="role" 
                                value={role} 
                                onChange={e => setRole(e.target.value)} 
                                placeholder="e.g. Admin, Manager, Support Agent..." 
                                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700" 
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Type in the role for this staff member. This determines what features and settings they can access within the dashboard.
                            </p>
                        </div>
                    </TabsContent>

                    {/* AVAILABILITY TAB */}
                    <TabsContent value="availability" className="space-y-4 mt-0">
                        <div className="space-y-3">
                            <Label>Working Days</Label>
                            <div className="flex flex-wrap gap-2">
                                {days.map(day => (
                                    <div 
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                                            workingDays.includes(day) 
                                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300' 
                                            : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        type="time" 
                                        value={workHoursStart} 
                                        onChange={e => setWorkHoursStart(e.target.value)}
                                        className="pl-9 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        type="time" 
                                        value={workHoursEnd} 
                                        onChange={e => setWorkHoursEnd(e.target.value)}
                                        className="pl-9 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700" 
                                    />
                                </div>
                            </div>
                        </div>
                        
                         <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Popover open={timezoneSearchOpen} onOpenChange={setTimezoneSearchOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={timezoneSearchOpen}
                                  className="w-full justify-between bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                >
                                  {timezone
                                    ? (() => {
                                        const selectedTz = timezones.find((tz) => tz.value === timezone);
                                        return selectedTz 
                                          ? `${getTimeForTimezone(selectedTz.offset, selectedTz.value)} ${selectedTz.city}${selectedTz.abbr ? ` (${selectedTz.abbr})` : ''}`
                                          : "Select timezone";
                                      })()
                                    : "Select timezone"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                                <div className="bg-white dark:bg-gray-800">
                                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <input
                                      type="text"
                                      placeholder="Search city or country..."
                                      value={timezoneSearchValue}
                                      onChange={(e) => setTimezoneSearchValue(e.target.value)}
                                      className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                                    />
                                  </div>
                                  <div 
                                    className="max-h-[280px] overflow-y-auto"
                                    onWheel={(e) => e.stopPropagation()}
                                  >
                                    {timezones
                                      .filter((tz) => {
                                        const searchTerm = timezoneSearchValue.toLowerCase();
                                        return (
                                          tz.city.toLowerCase().includes(searchTerm) ||
                                          tz.country.toLowerCase().includes(searchTerm) ||
                                          tz.abbr.toLowerCase().includes(searchTerm) ||
                                          tz.aliases.toLowerCase().includes(searchTerm)
                                        );
                                      })
                                      .map((tz, index) => (
                                        <button
                                          key={`${tz.value}-${index}`}
                                          onClick={() => {
                                            setTimezone(tz.value);
                                            setTimezoneSearchOpen(false);
                                            setTimezoneSearchValue('');
                                          }}
                                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                            timezone === tz.value
                                              ? 'bg-blue-50 dark:bg-blue-950/20'
                                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                          }`}
                                        >
                                          {timezone === tz.value ? (
                                            <svg
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                              className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                                          )}
                                          <div className="flex flex-col items-start flex-1 min-w-0">
                                            <span className={`text-sm truncate ${
                                              timezone === tz.value
                                                ? 'text-gray-900 dark:text-gray-100'
                                                : 'text-gray-900 dark:text-gray-100'
                                            }`}>
                                              {tz.city}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                              {getTimeForTimezone(tz.offset, tz.value)} • {tz.country}{tz.abbr && ` • ${tz.abbr}`}
                                            </span>
                                          </div>
                                        </button>
                                      ))}
                                    {timezones.filter((tz) => {
                                      const searchTerm = timezoneSearchValue.toLowerCase();
                                      return (
                                        tz.city.toLowerCase().includes(searchTerm) ||
                                        tz.country.toLowerCase().includes(searchTerm) ||
                                        tz.abbr.toLowerCase().includes(searchTerm) ||
                                        tz.aliases.toLowerCase().includes(searchTerm)
                                      );
                                    }).length === 0 && (
                                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No timezone found.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                        </div>
                    </TabsContent>

                    {/* SKILLS TAB */}
                    <TabsContent value="skills" className="space-y-4 mt-0">
                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills & Expertise</Label>
                            <Textarea 
                                id="skills" 
                                value={skills} 
                                onChange={e => { setSkills(e.target.value); if (validationAlert) setValidationAlert(''); }} 
                                placeholder="E.g. Customer Support, Technical Troubleshooting, Sales Negotiation..."
                                className="h-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="certifications">Certifications</Label>
                            <Input 
                                id="certifications" 
                                value={certifications} 
                                onChange={e => { setCertifications(e.target.value); if (validationAlert) setValidationAlert(''); }} 
                                placeholder="E.g. Certified Scum Master, PMP..." 
                                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                            />
                        </div>
                    </TabsContent>

                    {/* EXTRA TAB */}
                    <TabsContent value="extra" className="space-y-4 mt-0">
                        <div className="space-y-2">
                            <Label htmlFor="notes">Extra Information</Label>
                            <Textarea 
                                id="notes" 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                                placeholder="Any additional notes about this staff member..."
                                className="h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                            />
                        </div>
                    </TabsContent>
                </div>
            </ScrollArea>
            </Tabs>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="mr-2">Cancel</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              {isEditing ? 'Save Changes' : 'Add Staff Member'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Validation Alert - Rendered OUTSIDE modal via Portal */}
    {createPortal(
      <AnimatePresence>
        {validationAlert && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ zIndex: 999999, position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto' }}
            className="w-[90vw] max-w-md"
          >
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/90 border border-red-300 dark:border-red-700 rounded-2xl shadow-2xl backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-800 dark:text-red-200" style={{ fontWeight: 600 }}>Required Information</p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">{validationAlert}</p>
              </div>
              <button
                onClick={() => setValidationAlert('')}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}
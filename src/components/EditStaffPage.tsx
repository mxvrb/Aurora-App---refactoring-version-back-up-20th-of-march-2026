import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Calendar, Award, FileText, Shield, Clock, AlertTriangle, X, ChevronsUpDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { StaffMember } from './AddStaffModal';

// Comprehensive timezone data (truncated for brevity, same as AddStaffModal)
const timezones = [
  { offset: -8, value: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', abbr: 'PT' },
  { offset: -5, value: 'America/New_York', city: 'New York', country: 'USA', abbr: 'ET' },
  { offset: 0, value: 'Europe/London', city: 'London', country: 'UK', abbr: 'GMT' },
  { offset: 1, value: 'Europe/Paris', city: 'Paris', country: 'France', abbr: 'CET' },
  { offset: 2, value: 'Asia/Jerusalem', city: 'Jerusalem', country: 'Israel', abbr: 'IST' },
  { offset: 4, value: 'Asia/Dubai', city: 'Dubai', country: 'UAE', abbr: 'GST' },
  { offset: 5.5, value: 'Asia/Kolkata', city: 'New Delhi', country: 'India', abbr: 'IST' },
  { offset: 8, value: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', abbr: 'SGT' },
  { offset: 9, value: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', abbr: 'JST' },
];

interface EditStaffPageProps {
  staffMember: StaffMember;
  onBack: () => void;
  onSave: (staff: StaffMember) => void;
}

export function EditStaffPage({ staffMember, onBack, onSave }: EditStaffPageProps) {
  // Form State
  const [firstName, setFirstName] = useState(staffMember.firstName);
  const [lastName, setLastName] = useState(staffMember.lastName);
  const [email, setEmail] = useState(staffMember.email);
  const [phone, setPhone] = useState(staffMember.phone);
  const [role, setRole] = useState(staffMember.role);
  const [workingDays, setWorkingDays] = useState<string[]>(staffMember.workingDays || []);
  const [workHoursStart, setWorkHoursStart] = useState(staffMember.workHoursStart || '09:00');
  const [workHoursEnd, setWorkHoursEnd] = useState(staffMember.workHoursEnd || '17:00');
  const [timezone, setTimezone] = useState(staffMember.timezone || 'UTC');
  const [skills, setSkills] = useState(staffMember.skills || '');
  const [certifications, setCertifications] = useState(staffMember.certifications || '');
  const [notes, setNotes] = useState(staffMember.notes || '');

  const [validationAlert, setValidationAlert] = useState('');
  const [timezoneSearchOpen, setTimezoneSearchOpen] = useState(false);
  const [timezoneSearchValue, setTimezoneSearchValue] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeForTimezone = (offset: number, timezoneId?: string): string => {
    try {
      if (timezoneId) {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezoneId, hour: '2-digit', minute: '2-digit', hour12: false
        });
        return formatter.format(currentTime);
      }
    } catch (e) {}
    const now = new Date(currentTime);
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (3600000 * offset));
    return localTime.toTimeString().slice(0, 5);
  };

  const handleSave = () => {
    if (!skills.trim() || !certifications.trim()) {
      setValidationAlert('Skills and certifications are required for AI optimization.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) return;

    onSave({
      ...staffMember,
      firstName, lastName, email, phone, role,
      workingDays, workHoursStart, workHoursEnd, timezone,
      skills, certifications, notes
    });
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-2">
      <Icon className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden">
      {/* Premium Glass Header */}
      <div 
        onClick={onBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg sticky top-0 z-20"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider text-sm">Back to Staff List</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-6 space-y-12 pb-32">
          
          {/* Section 1: Basic Details */}
          <section>
            <SectionHeader icon={User} title="Basic Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">First Name</Label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. Ahmed" className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Name</Label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Al Mansouri" className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email Address</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ahmed@example.com" className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 123 4567" className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl" />
              </div>
            </div>
          </section>

          {/* Section 2: Role Assignment */}
          <section>
            <SectionHeader icon={Shield} title="Role & Access" />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Job Role</Label>
              <Input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Manager, Support Agent, Sales..." className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl" />
              <p className="text-xs text-gray-500 mt-1">This role helps the AI understand the context of this staff member's responsibilities.</p>
            </div>
          </section>

          {/* Section 3: Availability */}
          <section>
            <SectionHeader icon={Calendar} title="Schedule & Availability" />
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Working Days</Label>
                <div className="flex flex-wrap gap-3">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => setWorkingDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${workingDays.includes(day) ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Start Time</Label>
                  <Input type="time" value={workHoursStart} onChange={e => setWorkHoursStart(e.target.value)} className="h-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> End Time</Label>
                  <Input type="time" value={workHoursEnd} onChange={e => setWorkHoursEnd(e.target.value)} className="h-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2"><Globe className="w-4 h-4" /> Timezone</Label>
                <Popover open={timezoneSearchOpen} onOpenChange={setTimezoneSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full h-12 justify-between bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl px-4 font-normal">
                      {timezone ? (() => {
                        const selectedTz = timezones.find((tz) => tz.value === timezone);
                        return selectedTz ? `${getTimeForTimezone(selectedTz.offset, selectedTz.value)} ${selectedTz.city} (${selectedTz.abbr})` : timezone;
                      })() : "Select timezone"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <div className="p-2 border-b"><Input placeholder="Search city..." value={timezoneSearchValue} onChange={e => setTimezoneSearchValue(e.target.value)} className="h-9 border-none focus-visible:ring-0" /></div>
                    <div className="max-h-60 overflow-y-auto p-1">
                      {timezones.filter(tz => tz.city.toLowerCase().includes(timezoneSearchValue.toLowerCase())).map(tz => (
                        <div key={tz.value} onClick={() => { setTimezone(tz.value); setTimezoneSearchOpen(false); }} className={`p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm flex justify-between items-center ${timezone === tz.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : ''}`}>
                          <span>{tz.city} ({tz.abbr})</span>
                          <span className="text-gray-400 text-xs">{getTimeForTimezone(tz.offset, tz.value)}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </section>

          {/* Section 4: Skills */}
          <section>
            <SectionHeader icon={Award} title="Skills & Expertise" />
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Primary Skills</Label>
                <Textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Arabic Speaking, High-ticket Sales, CRM Management..." className="min-h-[120px] bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl resize-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Certifications</Label>
                <Input value={certifications} onChange={e => setCertifications(e.target.value)} placeholder="e.g. HubSpot Certified, PMP, Real Estate License..." className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl" />
              </div>
            </div>
          </section>

          {/* Section 5: Extra */}
          <section>
            <SectionHeader icon={FileText} title="Additional Information" />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Internal Notes</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any other details the AI should keep in mind..." className="min-h-[160px] bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-xl resize-none" />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="pt-10 flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSave} className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98]">
              Save Changes
            </Button>
            <Button variant="outline" onClick={onBack} className="sm:w-32 h-14 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              Cancel
            </Button>
          </div>

        </div>
      </ScrollArea>

      <AnimatePresence>
        {validationAlert && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            <div className="bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-900 p-5 rounded-2xl shadow-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 text-sm font-semibold text-red-800 dark:text-red-200">{validationAlert}</div>
              <button onClick={() => setValidationAlert('')} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors">
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

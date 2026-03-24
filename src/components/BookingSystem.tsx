import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { toast } from "sonner";

interface BookingSystemProps {
  onBack: () => void;
}

const BUSINESS_TYPES = [
  'Restaurant',
  'Salon',
  'Clinic',
  'Gym',
  'Tutor',
  'Car Rental',
  'Spa',
  'Barbershop',
  'Photography Studio',
  'Consulting',
  'Other'
];

export function BookingSystem({ onBack }: BookingSystemProps) {
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bookingSystemSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    businessType: 'Restaurant',
    totalSpots: 10,
    bookingTypes: ['Table for 2', 'Table for 4'],
    bookingDuration: 60,
    flexibleDuration: false,
    operatingHoursStart: '09:00',
    operatingHoursEnd: '18:00',
    timeSlotInterval: 30
  };

  const [businessType, setBusinessType] = useState(initialState?.businessType ?? defaultSettings.businessType);
  const [totalSpots, setTotalSpots] = useState(initialState?.totalSpots ?? defaultSettings.totalSpots);
  const [bookingTypes, setBookingTypes] = useState<string[]>(initialState?.bookingTypes ?? defaultSettings.bookingTypes);
  const [bookingDuration, setBookingDuration] = useState(initialState?.bookingDuration ?? defaultSettings.bookingDuration);
  const [flexibleDuration, setFlexibleDuration] = useState(initialState?.flexibleDuration ?? defaultSettings.flexibleDuration);
  const [operatingHoursStart, setOperatingHoursStart] = useState(initialState?.operatingHoursStart ?? defaultSettings.operatingHoursStart);
  const [operatingHoursEnd, setOperatingHoursEnd] = useState(initialState?.operatingHoursEnd ?? defaultSettings.operatingHoursEnd);
  const [timeSlotInterval, setTimeSlotInterval] = useState(initialState?.timeSlotInterval ?? defaultSettings.timeSlotInterval);
  const [newType, setNewType] = useState('');



  const handleSave = () => {
    const settings = {
      businessType,
      totalSpots,
      bookingTypes,
      bookingDuration,
      flexibleDuration,
      operatingHoursStart,
      operatingHoursEnd,
      timeSlotInterval
    };
    
    localStorage.setItem('bookingSystemSettings', JSON.stringify(settings));
    toast.success('Booking system settings saved!');
  };

  const addBookingType = () => {
    if (newType.trim() && !bookingTypes.includes(newType.trim())) {
      setBookingTypes([...bookingTypes, newType.trim()]);
      setNewType('');
    }
  };

  const removeBookingType = (type: string) => {
    setBookingTypes(bookingTypes.filter(t => t !== type));
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Floating glassmorphism back button */}
      <div 
        onClick={onBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Booking System</span>
      </div>
      
      <div className="p-6 space-y-6">
        
        {/* Business Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Type</Label>
          <Select value={businessType} onValueChange={setBusinessType}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Total Spots */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Spots/Seats/Tables Available</Label>
          <Input
            type="number"
            value={totalSpots}
            onChange={(e) => setTotalSpots(parseInt(e.target.value) || 0)}
            min={1}
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Booking Types */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Booking Types (Optional)</Label>
          <div className="space-y-2">
            {bookingTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={type}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBookingType(type)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Add new type (e.g., Table for 6)"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex-1"
                onKeyDown={(e) => e.key === 'Enter' && addBookingType()}
              />
              <Button
                onClick={addBookingType}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newType.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Booking Duration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Booking Duration</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={bookingDuration}
              onChange={(e) => setBookingDuration(parseInt(e.target.value) || 30)}
              min={15}
              step={15}
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 w-24"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={flexibleDuration}
              onCheckedChange={setFlexibleDuration}
            />
            <Label className="text-sm text-gray-600 dark:text-gray-400">Allow flexible duration</Label>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Operating Hours</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500 dark:text-gray-400">Start Time</Label>
              <Input
                type="time"
                value={operatingHoursStart}
                onChange={(e) => setOperatingHoursStart(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500 dark:text-gray-400">End Time</Label>
              <Input
                type="time"
                value={operatingHoursEnd}
                onChange={(e) => setOperatingHoursEnd(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Time Slot Interval */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Slot Intervals</Label>
          <Select value={timeSlotInterval.toString()} onValueChange={(v) => setTimeSlotInterval(parseInt(v))}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="120">120 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
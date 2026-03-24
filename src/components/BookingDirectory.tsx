import React, { useContext } from 'react';
import { BookOpen, Calendar, Bell, MessageSquare, FileText, ChevronRight, CalendarCheck, Link2, UserCheck } from 'lucide-react';
import { BookingSystem } from './BookingSystem';
import { AlertDestination } from './AlertDestination';
import { AlertInstructions } from './AlertInstructions';
import { CustomizeMessage } from './CustomizeMessage';
import { FilterContext } from '../contexts/FilterContext';

interface BookingDirectoryProps {
  onNavigate: (page: string) => void;
}

export function BookingDirectory({ onNavigate }: BookingDirectoryProps) {
  const { getFilterClasses } = useContext(FilterContext);

  return (
    <div className="flex flex-col gap-3 px-4 pb-3">
      
      {/* Control Manual Confirmations */}
      <div
        onClick={() => onNavigate('manual-confirmation')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Require Booking Approval')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Require Booking Approval</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Sync External Platform */}
      <div
        onClick={() => onNavigate('sync-external-platform')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Request Sync to External Platform')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Request Sync to External Platform</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Request Custom Booking System (MCP) */}
      <div
        onClick={() => onNavigate('request-custom-booking-system')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Request Custom Booking System (MCP)')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Request Custom Booking System (MCP)</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

    </div>
  );
}

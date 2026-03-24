import React, { useContext } from 'react';
import { ChevronRight } from 'lucide-react';
import { FilterContext } from '../contexts/FilterContext';

interface SetRemindersProps {
  onNavigate: (page: string) => void;
}

export function SetReminders({ onNavigate }: SetRemindersProps) {
  const { getFilterClasses } = useContext(FilterContext);

  return (
    <div className="flex flex-col gap-3 px-4 pb-3">

      {/* Set Pre-Appointment Reminders */}
      <div
        onClick={() => onNavigate('appointment')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Appointment Reminders')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Set Pre-Appointment Reminders</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Abandoned Chat Notification */}
      <div
        onClick={() => onNavigate('abandoned-chat')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Abandoned Chat Reminders')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Abandoned Chat Notification</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Set Holiday Messages */}
      <div
        onClick={() => onNavigate('holiday')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Holiday Messages')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Set Holiday Messages</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Exclude Customers From Receiving */}
      <div
        onClick={() => onNavigate('exclusion')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Customer Exclusion List')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Exclude Customers From Receiving</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

    </div>
  );
}

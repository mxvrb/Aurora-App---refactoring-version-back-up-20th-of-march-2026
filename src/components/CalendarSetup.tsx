import React, { useState, useEffect, useContext } from 'react';
import { ChevronRight, Server, Globe, Plus } from 'lucide-react';
import { FilterContext } from '../contexts/FilterContext';

interface CalendarSetupProps {
  onNavigate: (page: string) => void;
}

export function CalendarSetup({ onNavigate }: CalendarSetupProps) {
  const { getFilterClasses } = useContext(FilterContext);
  const [caldavSettingsList, setCaldavSettingsList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('caldavCalendarSettingsList');
      if (saved) {
        setCaldavSettingsList(JSON.parse(saved));
      } else {
        // Fallback for previous single setting
        const oldSaved = localStorage.getItem('caldavCalendarSettings');
        if (oldSaved) {
          const parsed = JSON.parse(oldSaved);
          if (parsed.isConnected) {
            const initialList = [{ ...parsed, id: Date.now().toString() }];
            setCaldavSettingsList(initialList);
            localStorage.setItem('caldavCalendarSettingsList', JSON.stringify(initialList));
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleEditCaldav = (id: string) => {
    localStorage.setItem('editingCaldavId', id);
    onNavigate('connect-caldav-calendar');
  };

  const handleAddCaldav = () => {
    localStorage.removeItem('editingCaldavId');
    onNavigate('connect-caldav-calendar');
  };

  return (
    <div className="flex flex-col gap-3 px-4 pb-3">
      
      {/* Connect Google Calendar */}
      <div
        onClick={() => onNavigate('connect-google-calendar')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Connect Google Calendar')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Connect Google Calendar</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Connect Outlook Calendar */}
      <div
        onClick={() => onNavigate('connect-outlook-calendar')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Connect Outlook Calendar')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Connect Outlook Calendar</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Connect Apple Calendar */}
      <div
        onClick={() => onNavigate('connect-apple-calendar')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Connect Apple Calendar')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Connect Apple Calendar</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Render Connected CalDAV Calendars */}
      {caldavSettingsList.map((settings) => (
        <div
          key={settings.id}
          onClick={() => handleEditCaldav(settings.id)}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className="flex items-center justify-between px-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-900/30 dark:to-indigo-900/20 backdrop-blur-xl rounded-2xl border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {settings.serverUrl ? new URL(settings.serverUrl.startsWith('http') ? settings.serverUrl : `https://${settings.serverUrl}`).hostname : 'External Server'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {settings.username || 'Connected'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full">Connected</span>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      ))}

      {/* Add External Calendar Platform */}
      <div
        onClick={handleAddCaldav}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center justify-center px-6 bg-transparent rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">Add external calendar</span>
        </div>
      </div>

    </div>
  );
}

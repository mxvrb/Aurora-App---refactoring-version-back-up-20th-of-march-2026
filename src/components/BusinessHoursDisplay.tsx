import React from 'react';

export const BusinessHoursDisplay = ({ businessHours, holidayDays }: { businessHours: any, holidayDays: any[] }) => {
  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hNum = parseInt(h, 10);
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    const h12 = hNum % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-5 pb-4 pt-1">
      {Object.entries(businessHours)
        .filter(([_, h]: any) => h.enabled)
        .map(([day, h]: any) => (
          <div key={day} className="flex flex-col p-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">{day}</span>
            <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">
              {formatTime(h.start)} - {formatTime(h.end)}
            </span>
          </div>
        ))}
      {holidayDays && holidayDays.length > 0 && (
        <div className="col-span-full mt-1 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-900/50">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {holidayDays.length} upcoming holiday{holidayDays.length !== 1 ? 's' : ''} configured
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Room } from './types';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Filter, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface BookingCalendarProps {
  rooms: Room[];
}

// Mock reservations
const MOCK_RESERVATIONS = [
  { id: '1', tableId: 't1', name: 'Smith', size: 4, start: 11, duration: 2, color: 'bg-blue-200 border-blue-400 text-blue-800' },
  { id: '2', tableId: 't2', name: 'Doe', size: 2, start: 12.5, duration: 1.5, color: 'bg-green-200 border-green-400 text-green-800' },
  { id: '3', tableId: 't3', name: 'Johnson', size: 6, start: 13, duration: 2, color: 'bg-purple-200 border-purple-400 text-purple-800' },
];

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ rooms }) => {
  const hours = Array.from({ length: 13 }, (_, i) => 10 + i); // 10 AM to 10 PM

  // Helper to collect all tables
  const tables = rooms.flatMap(room => 
    room.objects.filter(o => o.type.includes('table') || o.type === 'booth').map(t => ({ ...t, roomName: room.name }))
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ChevronLeft className="w-4 h-4" /></Button>
             <div className="flex items-center px-2 space-x-2">
               <CalendarIcon className="w-4 h-4 text-gray-500" />
               <span className="text-sm font-medium">Today, Dec 19</span>
             </div>
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
           </div>
           
           <Select defaultValue="lunch">
             <SelectTrigger className="w-32 h-9">
               <SelectValue placeholder="Period" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="breakfast">Breakfast</SelectItem>
               <SelectItem value="lunch">Lunch</SelectItem>
               <SelectItem value="dinner">Dinner</SelectItem>
             </SelectContent>
           </Select>
        </div>

        <div className="flex items-center space-x-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Filter className="w-4 h-4" /> Filter
           </Button>
           <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
             <Clock className="w-4 h-4" /> New Booking
           </Button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px]">
          {/* Header Row (Time) */}
          <div className="sticky top-0 z-20 flex bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="w-40 shrink-0 p-3 font-semibold text-gray-500 text-xs uppercase tracking-wider bg-gray-50 dark:bg-gray-800 sticky left-0 z-30 border-r border-gray-200 dark:border-gray-700">
              Table / Room
            </div>
            {hours.map(h => (
              <div key={h} className="flex-1 min-w-[80px] border-r border-gray-200 dark:border-gray-700 p-2 text-center text-xs font-medium text-gray-500">
                {h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>

          {/* Rows */}
          {tables.map(table => {
            // Find reservation for this table (mock)
            // In reality, match by table.id
            // For mock, we just randomly assign if ID matches mock or just show example
             // Use pseudo-random logic for demo
            const reservation = MOCK_RESERVATIONS.find(r => r.tableId === 't1' && table.label === '1'); 
            
            return (
              <div key={table.id} className="flex border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                {/* Table Label */}
                <div className="w-40 shrink-0 p-3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky left-0 z-10 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{table.label || 'T-?'}</span>
                    <span className="text-xs text-gray-400">{table.seats}p</span>
                  </div>
                  <span className="text-[10px] text-gray-500 truncate">{table.roomName}</span>
                </div>

                {/* Time Slots */}
                <div className="flex-1 flex relative">
                  {/* Grid Lines */}
                  {hours.map(h => (
                    <div key={h} className="flex-1 min-w-[80px] border-r border-gray-100 dark:border-gray-800" />
                  ))}

                  {/* Render Reservations (Absolute positioning based on time) */}
                  {/* Mock reservation logic: Place random blocks for visual effect if no real data */}
                  {parseInt(table.label || '0') % 3 === 0 && (
                    <div 
                      className="absolute top-1 bottom-1 rounded-md bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 p-2 overflow-hidden cursor-pointer hover:shadow-md transition-all z-10"
                      style={{
                        left: `${((12 - 10) / 13) * 100}%`, // Starts at 12
                        width: `${(1.5 / 13) * 100}%` // 1.5 hours
                      }}
                    >
                      <div className="font-semibold text-xs text-blue-900 dark:text-blue-100 truncate">Smith (4)</div>
                      <div className="text-[10px] text-blue-700 dark:text-blue-300">Confirmed</div>
                    </div>
                  )}
                  
                   {parseInt(table.label || '0') % 5 === 0 && (
                    <div 
                      className="absolute top-1 bottom-1 rounded-md bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 p-2 overflow-hidden cursor-pointer hover:shadow-md transition-all z-10"
                      style={{
                        left: `${((18 - 10) / 13) * 100}%`, // Starts at 6 PM
                        width: `${(2 / 13) * 100}%` // 2 hours
                      }}
                    >
                      <div className="font-semibold text-xs text-green-900 dark:text-green-100 truncate">Birthday (6)</div>
                      <div className="text-[10px] text-green-700 dark:text-green-300">Seated</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import * as fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

const targetSection = `{/* Opening Times Section - Compact strip below split view */}
              <div className="bg-white dark:bg-gray-800 mt-auto border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center px-4 py-3">
                  <div ref={openingTimesCardRef} className="w-full max-w-[700px] px-2">
                    {/* Header row — title, status, toggle, and action buttons all inline */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{savedBusinessHours ? 'Opening Times' : 'Add Opening Times'}</h3>
                      
                      {/* Inline status */}
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled)
                          ? 'Configured'
                          : savedBusinessHours && Object.values(savedBusinessHours).every(hours => !hours.enabled)
                            ? 'Closed all days'
                            : 'Not configured'}
                      </span>

                      {/* Spacer */}
                      <div className="flex-1" />
                      
                      {/* Compact action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowBusinessHours(true)}
                          className="flex items-center gap-2 px-4 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-sm"
                        >
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Configure Hours</span>
                        </button>
                        <button
                          onClick={() => setShowCalendarModal(true)}
                          className="flex items-center gap-2 px-4 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-sm"
                        >
                          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">View Calendar</span>
                        </button>
                        {/* View/Hide toggle */}
                        {savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled) && (
                          <button
                            onClick={() => setShowOpeningTimesDetails(!showOpeningTimesDetails)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/80 dark:bg-gray-700/60 hover:bg-gray-200/80 dark:hover:bg-gray-600/60 transition-all cursor-pointer border border-gray-200 dark:border-gray-600"
                          >
                            {showOpeningTimesDetails ? (
                              <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Expandable details — only shown when toggled */}
                    {showOpeningTimesDetails && savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled) && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="flex gap-2 w-full overflow-x-auto pb-2 [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                          {(() => {
                            const today = new Date();
                            const currentDayOfWeek = today.getDay(); 
                            const distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
                            const monday = new Date(today);
                            monday.setDate(today.getDate() - distanceToMonday);

                            const dayNamesFull = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                            const dayNamesShort = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
                            
                            // Map 0-6 to actual day indices starting from Monday (1, 2, 3, 4, 5, 6, 0)
                            const getDayIndexForMondayStart = (index: number) => {
                              return index === 6 ? 0 : index + 1;
                            };

                            return Array.from({ length: 7 }).map((_, i) => {
                              const date = new Date(monday);
                              date.setDate(monday.getDate() + i);
                              const isToday = date.toDateString() === today.toDateString();
                              
                              const dayIndex = date.getDay();
                              const fullDayName = dayNamesFull[dayIndex];
                              // our dayNamesShort array is ordered Mo to Su
                              const shortDayName = dayNamesShort[i];
                              const dayOfMonth = date.getDate();
                              
                              const isHoliday = holidayDays.some(hDate => new Date(hDate).toDateString() === date.toDateString());
                              
                              const hours = (savedBusinessHours as any)?.[fullDayName];
                              const isClosed = !hours?.enabled || isHoliday;
                              
                              return (
                                <div key={fullDayName} className={\`flex-1 min-w-[76px] flex flex-col rounded-[10px] overflow-hidden bg-white dark:bg-gray-900 border \${isToday ? 'border-blue-400 dark:border-blue-500 shadow-sm' : 'border-gray-200/80 dark:border-gray-700 shadow-sm'}\`}>
                                  {/* Top part */}
                                  <div className={\`py-2 px-1.5 flex flex-col items-center justify-center relative \${isToday ? 'bg-blue-500 text-white' : 'bg-gray-200/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}\`}>
                                    <div className="flex items-center justify-center w-full relative">
                                      <span className="text-[12px] font-medium opacity-80">{shortDayName}</span>
                                    </div>
                                    <span className="text-2xl font-semibold leading-tight mt-0.5">{dayOfMonth}</span>
                                  </div>
                                  {/* Bottom part */}
                                  <div className={\`py-2.5 px-1 text-center flex-1 flex flex-col items-center justify-center\`}>
                                    <span className={\`text-[11px] font-semibold whitespace-nowrap \${isClosed ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}\`}>
                                      {isClosed ? 'Closed' : \`\${hours?.start}-\${hours?.end}\`}
                                    </span>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Not configured hint — compact */}
                    {!(savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled)) && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                        Set operating hours to guide AI availability
                      </p>
                    )}
                  </div>
                </div>
              </div>`;

const newSection = `{/* Opening Times Section - Floating Pill */}
              <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
                <motion.div 
                  layout
                  ref={openingTimesCardRef}
                  className="bg-white/90 dark:bg-[#1A2333]/90 backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[28px] overflow-hidden pointer-events-auto flex flex-col max-w-[700px] w-full"
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                >
                  <motion.div layout className="flex items-center gap-3 px-5 py-3">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {savedBusinessHours ? 'Opening Times' : 'Add Opening Times'}
                    </h3>
                    
                    {/* Inline status */}
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap hidden sm:inline-block">
                      {savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled)
                        ? 'Configured'
                        : savedBusinessHours && Object.values(savedBusinessHours).every(hours => !hours.enabled)
                          ? 'Closed all days'
                          : 'Not configured'}
                    </span>

                    {/* Spacer */}
                    <div className="flex-1" />
                    
                    {/* Compact action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowBusinessHours(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 dark:bg-gray-700/50 rounded-full border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-200/80 dark:hover:bg-gray-600/60 transition-all cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline">Configure</span>
                      </button>
                      <button
                        onClick={() => setShowCalendarModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 dark:bg-gray-700/50 rounded-full border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-200/80 dark:hover:bg-gray-600/60 transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline">Calendar</span>
                      </button>
                      {/* View/Hide toggle */}
                      {savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled) && (
                        <button
                          onClick={() => setShowOpeningTimesDetails(!showOpeningTimesDetails)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/80 dark:bg-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-600/60 transition-all cursor-pointer border border-gray-200/50 dark:border-gray-600/50"
                        >
                          <motion.div
                            initial={false}
                            animate={{ rotate: showOpeningTimesDetails ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </motion.div>
                        </button>
                      )}
                    </div>
                  </motion.div>

                  {/* Expandable details */}
                  <AnimatePresence initial={false}>
                    {showOpeningTimesDetails && savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled) && (
                      <motion.div 
                        key="opening-times-details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-2 border-t border-gray-100/50 dark:border-white/5">
                          <div className="flex gap-2 w-full overflow-x-auto pb-2 [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                            {(() => {
                              const today = new Date();
                              const currentDayOfWeek = today.getDay(); 
                              const distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
                              const monday = new Date(today);
                              monday.setDate(today.getDate() - distanceToMonday);

                              const dayNamesFull = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                              const dayNamesShort = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
                              
                              return Array.from({ length: 7 }).map((_, i) => {
                                const date = new Date(monday);
                                date.setDate(monday.getDate() + i);
                                const isToday = date.toDateString() === today.toDateString();
                                
                                const dayIndex = date.getDay();
                                const fullDayName = dayNamesFull[dayIndex];
                                const shortDayName = dayNamesShort[i];
                                const dayOfMonth = date.getDate();
                                
                                const isHoliday = holidayDays.some(hDate => new Date(hDate).toDateString() === date.toDateString());
                                
                                const hours = (savedBusinessHours as any)?.[fullDayName];
                                const isClosed = !hours?.enabled || isHoliday;
                                
                                return (
                                  <div key={fullDayName} className={\`flex-1 min-w-[76px] flex flex-col rounded-[14px] overflow-hidden bg-white dark:bg-gray-900 border \${isToday ? 'border-blue-400 dark:border-blue-500 shadow-sm' : 'border-gray-200/80 dark:border-gray-700 shadow-sm'}\`}>
                                    {/* Top part */}
                                    <div className={\`py-2 px-1.5 flex flex-col items-center justify-center relative \${isToday ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}\`}>
                                      <div className="flex items-center justify-center w-full relative">
                                        <span className="text-[12px] font-medium opacity-80">{shortDayName}</span>
                                      </div>
                                      <span className="text-2xl font-semibold leading-tight mt-0.5">{dayOfMonth}</span>
                                    </div>
                                    {/* Bottom part */}
                                    <div className={\`py-2.5 px-1 text-center flex-1 flex flex-col items-center justify-center\`}>
                                      <span className={\`text-[11px] font-semibold whitespace-nowrap \${isClosed ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}\`}>
                                        {isClosed ? 'Closed' : \`\${hours?.start}-\${hours?.end}\`}
                                      </span>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Not configured hint */}
                  {!(savedBusinessHours && Object.values(savedBusinessHours).some(hours => hours.enabled)) && (
                    <motion.div layout className="px-5 pb-3 -mt-1">
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        Set operating hours to guide AI availability
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>`;

if (content.includes(targetSection)) {
  content = content.replace(targetSection, newSection);
  fs.writeFileSync('App.tsx', content);
  console.log('Successfully replaced opening times section with pill format');
} else {
  console.log('Target section not found!');
  // Let's do a fallback replace using splitting just in case of formatting issues
  const startMarker = "{/* Opening Times Section - Compact strip below split view */}";
  const endMarker = "Set operating hours to guide AI availability\n                      </p>\n                    )}\n                  </div>\n                </div>\n              </div>";
  
  if (content.includes(startMarker) && content.includes(endMarker)) {
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker) + endMarker.length;
    content = content.substring(0, startIdx) + newSection + content.substring(endIdx);
    fs.writeFileSync('App.tsx', content);
    console.log('Successfully replaced via markers');
  } else {
    console.log('Fallback also failed.');
  }
}

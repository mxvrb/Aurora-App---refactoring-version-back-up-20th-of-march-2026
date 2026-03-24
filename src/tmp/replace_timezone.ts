const file = Deno.readTextFileSync('/App.tsx');
const lines = file.split('\n');
const startLine = lines.findIndex(l => l.includes('{/* Select Timezone Submenu */}'));
const endLine = lines.findIndex((l, i) => i > startLine && l.includes('{/* Personalize Submenu */}'));

if (startLine !== -1 && endLine !== -1) {
  console.log(`Start: ${startLine + 1}, End: ${endLine + 1}`);
  
  const componentCall = `                {/* Select Timezone Submenu */}
                {activeSubmenu === 'select-timezone' && (
                  <SelectTimezoneSubmenu
                    timezones={timezones}
                    countryCodes={countryCodes}
                    tempTimezone={tempTimezone}
                    setTempTimezone={setTempTimezone}
                    tempPreferredCountryCode={tempPreferredCountryCode}
                    setTempPreferredCountryCode={setTempPreferredCountryCode}
                    tempCallerLocationDetection={tempCallerLocationDetection}
                    setTempCallerLocationDetection={setTempCallerLocationDetection}
                    tempLocationResponseMode={tempLocationResponseMode}
                    setTempLocationResponseMode={setTempLocationResponseMode}
                    tempLocationCustomMessage={tempLocationCustomMessage}
                    setTempLocationCustomMessage={setTempLocationCustomMessage}
                    tempOtherStoreLocations={tempOtherStoreLocations}
                    setTempOtherStoreLocations={setTempOtherStoreLocations}
                    locationValidationErrors={locationValidationErrors}
                    setLocationValidationErrors={setLocationValidationErrors}
                    hasUnsavedChanges={hasUnsavedChanges}
                    setActiveSubmenu={setActiveSubmenu}
                    setPendingNavigation={setPendingNavigation}
                    setUnsavedSubmenu={setUnsavedSubmenu}
                    setShowUnsavedChangesDialog={setShowUnsavedChangesDialog}
                    setTimezone={setTimezone}
                    setPreferredCountryCode={setPreferredCountryCode}
                    setCallerLocationDetection={setCallerLocationDetection}
                    setLocationResponseMode={setLocationResponseMode}
                    setLocationCustomMessage={setLocationCustomMessage}
                    setOtherStoreLocations={setOtherStoreLocations}
                  />
                )}

`;

  const newLines = [
    ...lines.slice(0, startLine),
    componentCall,
    ...lines.slice(endLine - 1) // Keep the empty lines before Personalize Submenu
  ];
  
  Deno.writeTextFileSync('/App.tsx', newLines.join('\n'));
  console.log('Successfully replaced Select Timezone Submenu in App.tsx');
} else {
  console.log('Could not find the bounds');
}

# Profile Page Replacement Instructions

## Location
Replace lines 21314-21934 in `/App.tsx`

## What to Replace
The entire section starting with:
```typescript
        {/* Main Content */}
        <div className="ml-20 min-h-screen flex items-start justify-center p-8 relative">
```

And ending with:
```typescript
        </div>
        </div>
```

## Replacement Code

```typescript
        {/* Main Content - Glassmorphism Profile Page */}
        <GlassmorphismProfilePage
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          userName={userName}
          email={email}
          profileImage={profileImage}
          defaultProfileIcon={defaultProfileIcon}
          companyName={companyName}
          lineOfBusiness={lineOfBusiness}
          userTier={userTier}
          showProfileEdit={showProfileEdit}
          setShowProfileEdit={setShowProfileEdit}
          isLoading={isLoading}
          isEditingCompanyName={isEditingCompanyName}
          editCompanyName={editCompanyName}
          setEditCompanyName={setEditCompanyName}
          handleCompanyNameEdit={handleCompanyNameEdit}
          handleCompanyNameSave={handleCompanyNameSave}
          handleCompanyNameCancel={handleCompanyNameCancel}
          isEditingBusiness={isEditingBusiness}
          editLineOfBusiness={editLineOfBusiness}
          setEditLineOfBusiness={setEditLineOfBusiness}
          showEditCustomBusiness={showEditCustomBusiness}
          setShowEditCustomBusiness={setShowEditCustomBusiness}
          editCustomBusiness={editCustomBusiness}
          setEditCustomBusiness={setEditCustomBusiness}
          editBusinessSelectOpen={editBusinessSelectOpen}
          setEditBusinessSelectOpen={setEditBusinessSelectOpen}
          editSearchValue={editSearchValue}
          setEditSearchValue={setEditSearchValue}
          editFilteredBusinesses={editFilteredBusinesses}
          handleBusinessEdit={handleBusinessEdit}
          handleBusinessSave={handleBusinessSave}
          handleBusinessCancel={handleBusinessCancel}
          highlightMatch={highlightMatch}
          handleTierChange={handleTierChange}
          upgradeHighlight={upgradeHighlight}
          handleLogout={handleLogout}
          setShowImageViewer={setShowImageViewer}
          setShowLanguageModal={setShowLanguageModal}
          selectedLanguage={selectedLanguage}
          error={error}
          getDisplayableError={getDisplayableError}
          isOnline={isOnline}
          serverAvailable={serverAvailable}
          syncQueue={syncQueue}
          onEditProfile={async () => {
            // Store current local state before fetching server data
            const currentLocalImage = profileImage;
            const localUserData = offlineStorage.getUserData();
            const hasLocallyRemovedImage = offlineStorage.isProfileImageRemoved();
            
            // Load latest profile data when opening edit modal
            if (accessToken && serverAvailable && isOnline) {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/auth/profile`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                  signal: controller.signal,
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                  const profileData = await response.json();
                  if (profileData.phone) setProfilePhone(profileData.phone);
                  if (profileData.website) setProfileWebsite(profileData.website);
                  
                  // Only update profile image from server if user hasn't locally removed it
                  if (!hasLocallyRemovedImage) {
                    if (profileData.profileImageUrl && profileData.profileImageUrl !== defaultProfileIcon) {
                      setProfileImage(profileData.profileImageUrl);
                    } else {
                      setProfileImage(null);
                    }
                  }
                  // If user has explicitly removed the image, keep it as null regardless of server data
                  // But only if they haven't uploaded a new image since then
                  if (hasLocallyRemovedImage && !currentLocalImage) {
                    console.log('✓ Respecting user\'s explicit profile image removal decision in edit button handler');
                    setProfileImage(null);
                  }
                } else if (response.status === 401) {
                  console.log('Session expired, using cached profile data');
                  // Don't change server availability for auth issues - just use cached data
                } else {
                  console.log('Failed to load profile data:', response.status);
                  // Don't change server availability for profile data issues - just use cached data
                }
              } catch (error) {
                console.log('Could not load latest profile data, using cached values');
                // Don't show error to user, just use cached values
              }
            }
            setShowProfileEdit(true);
          }}
        />
```

## Implementation Notes

1. The import statement for `GlassmorphismProfilePage` has already been added to the top of App.tsx
2. All existing functionality is preserved - only the UI/layout has changed
3. The `onEditProfile` handler maintains the exact same logic as the original edit button onClick
4. All state variables and handlers are passed as props to maintain functionality
5. The sync indicators and dark mode toggle are now integrated into the new component's header
6. The EditProfileModal component call remains below this section and doesn't need to be changed


Choose Model Code (Lines 15774-15979)
{/* Choose Model Submenu */}
{activeSubmenu === 'choose-model' && (
  <div className="w-full bg-white dark:bg-gray-800">
  {/* Header with Back Button */}
  <div 
    onClick={() => handleNavigationAttempt(null)}
    style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
    className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
  >
    <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
    <span className="font-medium text-gray-900 dark:text-gray-100">Choose Model</span>
  </div>
  
  <div className="px-6 pt-4 pb-6 space-y-3">
    <div className="space-y-2">
      <Label className="text-gray-900 dark:text-gray-100">Select AI Model for Your Business</Label>
      
      {/* GPT-4 */}
      <button
        onClick={() => setTempSelectedModel('GPT-4')}
        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
          tempSelectedModel === 'GPT-4'
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm text-gray-900 dark:text-gray-100">GPT-4</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
              Online stores, product sales. Best for complex questions.
            </p>
          </div>
          {getRecommendedModel(lineOfBusiness) === 'GPT-4' && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] rounded flex-shrink-0">
              Recommended
            </span>
          )}
          {tempSelectedModel === 'GPT-4' ? (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
          )}
        </div>
      </button>

      {/* Claude 3.5 Sonnet */}
      <button
        onClick={() => setTempSelectedModel('Claude 3.5 Sonnet')}
        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
          tempSelectedModel === 'Claude 3.5 Sonnet'
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm text-gray-900 dark:text-gray-100">Claude 3.5 Sonnet</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
              Consultants, coaches, advisors. Ideal for natural conversations.
            </p>
          </div>
          {getRecommendedModel(lineOfBusiness) === 'Claude 3.5 Sonnet' && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] rounded flex-shrink-0 font-[Alata]">
              Recommended
            </span>
          )}
          {tempSelectedModel === 'Claude 3.5 Sonnet' ? (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
          )}
        </div>
      </button>

      {/* Claude 3 Opus */}
      <button
        onClick={() => setTempSelectedModel('Claude 3 Opus')}
        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
          tempSelectedModel === 'Claude 3 Opus'
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400 [--stroke-0:currentColor]">
            <ThreeDGlasses1 />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm text-gray-900 dark:text-gray-100">Claude 3 Opus</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
              Doctors, lawyers, accountants. Most accurate & professional.
            </p>
          </div>
          {getRecommendedModel(lineOfBusiness) === 'Claude 3 Opus' && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] rounded flex-shrink-0 font-[Alata]">
              Recommended
            </span>
          )}
          {tempSelectedModel === 'Claude 3 Opus' ? (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
          )}
        </div>
      </button>

      {/* Gemini Pro */}
      <button
        onClick={() => setTempSelectedModel('Gemini Pro')}
        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
          tempSelectedModel === 'Gemini Pro'
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm text-gray-900 dark:text-gray-100">Gemini Pro</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
              Restaurants, hotels, tourism. Multilingual support.
            </p>
          </div>
          {getRecommendedModel(lineOfBusiness) === 'Gemini Pro' && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] rounded flex-shrink-0 font-[Alata]">
              Recommended
            </span>
          )}
          {tempSelectedModel === 'Gemini Pro' ? (
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
          )}
        </div>
      </button>
    </div>
    
    <Button
      onClick={() => {
        setSelectedModel(tempSelectedModel);
        setActiveSubmenu(null);
        toast.success('AI model updated successfully');
      }}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      Save Changes
    </Button>
  </div>
  </div>
)}
Button that opens Choose Model (Lines 15540-15561)
{/* Choose Model */}
<div 
  onClick={() => {
    if (activeSubmenu && hasUnsavedChanges(activeSubmenu)) {
      setTempSelectedModel(selectedModel);
      setPendingNavigation('choose-model');
      setUnsavedSubmenu(activeSubmenu);
      setShowUnsavedChangesDialog(true);
    } else {
      setTempSelectedModel(selectedModel);
      setActiveSubmenu('choose-model');
    }
  }}
  style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
  className="flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
>
  <span className="font-medium text-gray-900 dark:text-gray-100">Choose Model</span>
  <div className="flex items-center space-x-2">
    {selectedModel && <span className="text-gray-600 dark:text-gray-400">{selectedModel}</span>}
    <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
  </div>
</div>
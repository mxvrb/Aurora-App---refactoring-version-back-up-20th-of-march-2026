import React, { useState, useEffect, useContext } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { FilterContext } from '../contexts/FilterContext';

interface SetReviewsProps {
  onNavigate: (page: string) => void;
}

export function SetReviews({ onNavigate }: SetReviewsProps) {
  const { getFilterClasses, selectedFilters } = useContext(FilterContext);
  const [customPlatforms, setCustomPlatforms] = useState<{id: string, name: string}[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('customReviewPlatforms');
      if (saved) setCustomPlatforms(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveCustomPlatforms = (platforms: {id: string, name: string}[]) => {
    setCustomPlatforms(platforms);
    localStorage.setItem('customReviewPlatforms', JSON.stringify(platforms));
    // Dispatch event to refresh App.tsx and reflect changes in filter sidebar
    window.dispatchEvent(new CustomEvent('acesai-local-storage-changed'));
  };

  const handleAddSubmit = () => {
    if (newPlatformName.trim()) {
      const newPlatform = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPlatformName.trim()
      };
      saveCustomPlatforms([...customPlatforms, newPlatform]);
    }
    setNewPlatformName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubmit();
    } else if (e.key === 'Escape') {
      setNewPlatformName('');
      setIsAdding(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    saveCustomPlatforms(customPlatforms.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 px-4 pb-3">
      
      {/* Google Reviews */}
      <div
        onClick={() => onNavigate('google-review')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Google Reviews')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Google Reviews</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* TrustPilot Reviews */}
      <div
        onClick={() => onNavigate('trustpilot-review')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('TrustPilot Reviews')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">TrustPilot Reviews</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Yelp Reviews */}
      <div
        onClick={() => onNavigate('yelp-review')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Yelp Reviews')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Yelp Reviews</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Internal Reviews */}
      <div
        onClick={() => onNavigate('internal-review')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Internal Reviews')}`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">Internal Reviews</span>
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </div>

      {/* Custom Platforms */}
      {customPlatforms.map((platform) => (
        <div
          key={platform.id}
          onClick={() => onNavigate(`custom-review-${platform.id}`)}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg group ${getFilterClasses(`Custom Review ${platform.id}`)}`}
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">{platform.name} Reviews</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleDelete(e, platform.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      ))}

      {/* Add New Platform Button / Input */}
      {isAdding ? (
        <div 
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className={`flex items-center px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg`}
        >
          <div className="flex items-center flex-1 gap-2">
            <input
              type="text"
              autoFocus
              value={newPlatformName}
              onChange={(e) => setNewPlatformName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddSubmit}
              placeholder="e.g. Zillow"
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">Reviews</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsAdding(true)}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className={`flex items-center justify-center px-6 bg-transparent rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer group`}
        >
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            <Plus className="w-4 h-4" />
            <span className="font-medium text-sm">Add external review platform</span>
          </div>
        </div>
      )}

    </div>
  );
}

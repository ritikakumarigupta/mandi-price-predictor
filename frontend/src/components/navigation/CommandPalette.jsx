import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, MapPin, Sprout, ArrowRight } from 'lucide-react';
import { MOCK_CROPS, MOCK_MANDIS } from '../../services/mockData';

export const CommandPalette = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle trigger
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCrops = MOCK_CROPS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-xl rounded-3xl glass-panel bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-white/15 shadow-2xl overflow-hidden backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/50 dark:border-white/10">
          <Search className="w-5 h-5 text-emerald-500 mr-3" />
          <input
            type="text"
            placeholder="Type a crop, mandi, or state (e.g. Wheat, Patna)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Crops & Commodities
          </div>
          {filteredCrops.map(crop => (
            <div
              key={crop.id}
              onClick={() => {
                onSelect({ cropId: crop.id });
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-500 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{crop.icon}</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500">
                  {crop.name}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {filteredCrops.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-400">
              No matching crops or mandis found.
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Navigate with arrows</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

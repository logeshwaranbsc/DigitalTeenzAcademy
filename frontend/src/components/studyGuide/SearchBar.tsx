import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  resultCount,
}) => {
  return (
    <div className="relative max-w-xl w-full">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Digital Marketing Guide (Modules, Days, SEO, Meta Ads, Flashcards)..."
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs lg:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 shadow-xs transition-all"
        />

        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {searchTerm && typeof resultCount === 'number' && (
        <div className="mt-1.5 px-2 text-[11px] font-bold text-slate-500">
          Found {resultCount} matching items for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

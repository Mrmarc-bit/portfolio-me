import React from 'react';
import { Search, Mic, Command } from 'lucide-react';

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full mb-8 relative z-20">
      <div className="glass-panel rounded-full p-2 flex items-center shadow-lg transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:bg-surface">
        <div className="pl-4 pr-3 text-textMuted">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects, skills, or experience..." 
          className="bg-transparent border-none outline-none text-textMain w-full placeholder-textMuted h-10"
        />
        <div className="hidden sm:flex gap-2 pr-2">
          <button className="p-2 hover:bg-surfaceHighlight rounded-full text-googleRed transition-colors">
            <Mic size={20} />
          </button>
          <div className="h-6 w-[1px] bg-borderColor my-auto mx-1"></div>
          <div className="flex items-center gap-1 px-3 py-1 bg-surfaceElevated rounded-full text-xs text-textMuted font-mono border border-borderColor">
            <Command size={12} />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className={`bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300 ${isExpanded ? 'w-full' : 'w-10'}`}>
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center"
      >
        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 text-blue-600 rounded-l-lg hover:text-blue-800 transition-colors ${isExpanded ? '' : 'rounded-r-lg'}`}
        >
          <Search size={18} />
        </button>
        
        {isExpanded && (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location..."
              className="flex-1 py-2 px-3 text-sm text-gray-700 outline-none bg-transparent"
              autoFocus
            />
            <button 
              type="submit"
              className="px-3 py-1 mr-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Go
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SearchBar;

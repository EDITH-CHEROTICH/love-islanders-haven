
import { useState, useEffect } from 'react';
import { SongOption } from '@/components/streaks/types';
import SongSearchBar from './SongSearchBar';
import SongList from './SongList';
import SearchError from './SearchError';
import CancelButton from './CancelButton';

export interface SongSearchSectionProps {
  songTitle: string;
  setSongTitle: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
  songOptions: SongOption[];
  clearSearch: () => void;
  performSearch?: () => void;
  searchError?: string;
  showSongInput?: boolean;
  onSongSelect?: (id: string) => void;
  onSongTitleChange?: React.Dispatch<React.SetStateAction<string>>;
  onCancelSearch?: () => void;
}

const SongSearchSection: React.FC<SongSearchSectionProps> = ({
  songTitle,
  setSongTitle,
  isSearching,
  songOptions,
  clearSearch,
  performSearch,
  searchError,
  showSongInput,
  onSongSelect,
  onSongTitleChange,
  onCancelSearch
}) => {
  const [debouncedTitle, setDebouncedTitle] = useState(songTitle);
  
  // Handle controlled input
  const handleTitleChange = (value: string) => {
    if (onSongTitleChange) {
      onSongTitleChange(value);
    } else {
      setSongTitle(value);
    }
  };
  
  // When song title changes, debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTitle(songTitle);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [songTitle]);
  
  // Auto-search when debounced title changes
  useEffect(() => {
    if (debouncedTitle && debouncedTitle.length > 2 && performSearch) {
      performSearch();
    }
  }, [debouncedTitle, performSearch]);
  
  const handleSearch = () => {
    if (performSearch) performSearch();
  };

  const handleSelectSong = (id: string) => {
    if (onSongSelect) {
      onSongSelect(id);
    }
  };
  
  const handleCancelSearch = () => {
    if (onCancelSearch) {
      onCancelSearch();
    } else {
      clearSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && performSearch) {
      e.preventDefault();
      performSearch();
    }
  };
  
  if (showSongInput === false) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <SongSearchBar
        songTitle={songTitle}
        onSongTitleChange={handleTitleChange}
        isSearching={isSearching}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
      />
      
      <SearchError error={searchError || ''} />
      
      <SongList
        songs={songOptions}
        onSelectSong={handleSelectSong}
      />
      
      <CancelButton
        visible={!!songTitle || songOptions.length > 0}
        onClick={handleCancelSearch}
      />
    </div>
  );
};

export default SongSearchSection;

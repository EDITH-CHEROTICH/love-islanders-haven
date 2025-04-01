
import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SongOption } from '@/hooks/use-song-search';

export interface SongSearchSectionProps {
  songTitle: string;
  setSongTitle: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
  songOptions: SongOption[];
  clearSearch: () => void;
  performSearch?: () => void;
  searchError?: string;
  searchResults?: SongOption[];
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
  searchResults,
  showSongInput,
  onSongSelect,
  onSongTitleChange,
  onCancelSearch
}) => {
  const [debouncedTitle, setDebouncedTitle] = useState(songTitle);
  
  // Handle controlled input
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
  
  if (showSongInput === false) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for a song..."
            value={songTitle}
            onChange={handleTitleChange}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && performSearch) {
                e.preventDefault();
                performSearch();
              }
            }}
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSearch}
          disabled={isSearching || !songTitle}
        >
          <Search size={16} />
        </Button>
      </div>
      
      {searchError && <p className="text-sm text-red-500">{searchError}</p>}
      
      {songOptions.length > 0 && (
        <div className="bg-black/20 rounded-md max-h-48 overflow-y-auto">
          <ul>
            {songOptions.map((song) => (
              <li 
                key={song.id}
                className="p-2 hover:bg-black/30 cursor-pointer flex items-center space-x-2"
                onClick={() => handleSelectSong(song.id)}
              >
                {song.albumArt && (
                  <img 
                    src={song.albumArt} 
                    alt={song.title} 
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm opacity-80">{song.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {(songTitle || songOptions.length > 0) && (
        <Button 
          type="button" 
          variant="ghost" 
          onClick={handleCancelSearch}
          size="sm"
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default SongSearchSection;

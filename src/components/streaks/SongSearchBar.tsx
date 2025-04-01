
import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SongSearchBarProps {
  songTitle: string;
  onSongTitleChange: (value: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SongSearchBar: React.FC<SongSearchBarProps> = ({
  songTitle,
  onSongTitleChange,
  isSearching,
  onSearch,
  onKeyDown
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSongTitleChange(e.target.value);
  };

  return (
    <div className="flex space-x-2">
      <div className="relative flex-1">
        <Input
          placeholder="Search for a song..."
          value={songTitle}
          onChange={handleTitleChange}
          className="w-full"
          onKeyDown={onKeyDown}
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
        onClick={onSearch}
        disabled={isSearching || !songTitle}
      >
        <Search size={16} />
      </Button>
    </div>
  );
};

export default SongSearchBar;

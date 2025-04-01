
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSongSearch } from '@/hooks/use-song-search';
import SelectedSongDisplay from './SelectedSongDisplay';

// Update type definitions to match expected props
interface SongSearchSectionProps {
  onSelectSong: (song: {
    title: string;
    artist: string;
    albumArt: string;
    previewUrl: string;
  }) => void;
  selectedSong: {
    title: string;
    artist: string;
    albumArt: string;
    previewUrl: string;
  } | null;
}

const SongSearchSection: React.FC<SongSearchSectionProps> = ({ onSelectSong, selectedSong }) => {
  const [query, setQuery] = useState('');
  const { searchResults, isSearching, searchError, performSearch } = useSongSearch();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };
  
  const handleSelectSong = (song: any) => {
    onSelectSong({
      title: song.name,
      artist: song.artists[0].name,
      albumArt: song.album.images[0]?.url || '',
      previewUrl: song.preview_url
    });
    setQuery('');
  };
  
  const handleClearSong = () => {
    onSelectSong({
      title: '',
      artist: '',
      albumArt: '',
      previewUrl: ''
    });
  };
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Add Music (Optional)</h3>
      
      {selectedSong && selectedSong.title ? (
        <SelectedSongDisplay
          selectedSong={selectedSong}
          onClearSong={handleClearSong}
        />
      ) : (
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!query.trim() || isSearching}
            className="bg-love hover:bg-love/90"
          >
            <Search size={16} className="mr-1" />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      )}
      
      {searchError && (
        <p className="text-red-500 text-sm mt-2">{searchError}</p>
      )}
      
      {searchResults && searchResults.length > 0 && !selectedSong?.title && (
        <div className="mt-3 max-h-60 overflow-y-auto bg-black/20 rounded-lg p-2">
          <h4 className="text-sm font-semibold mb-2 px-2">Results</h4>
          <ul className="space-y-1">
            {searchResults.map((song) => (
              <li 
                key={song.id}
                onClick={() => handleSelectSong(song)}
                className="flex items-center p-2 hover:bg-white/10 rounded-md cursor-pointer transition-colors"
              >
                <img 
                  src={song.album.images[2]?.url || '/placeholder.svg'} 
                  alt={song.name} 
                  className="w-10 h-10 mr-3 rounded"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{song.name}</p>
                  <p className="text-xs opacity-70 truncate">
                    {song.artists.map(a => a.name).join(', ')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SongSearchSection;

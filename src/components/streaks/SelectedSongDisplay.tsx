
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectedSongDisplayProps {
  selectedSong: {
    title: string;
    artist: string;
    albumArt: string;
    previewUrl: string;
  } | null;
  onClearSong: () => void;
}

const SelectedSongDisplay: React.FC<SelectedSongDisplayProps> = ({ selectedSong, onClearSong }) => {
  if (!selectedSong) return null;
  
  return (
    <div className="p-4 border rounded-lg flex items-center space-x-3 bg-black/20 my-4 relative">
      <img 
        src={selectedSong.albumArt} 
        alt={`${selectedSong.title} album cover`} 
        className="w-12 h-12 rounded-md object-cover"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{selectedSong.title}</h4>
        <p className="text-sm opacity-80 truncate">{selectedSong.artist}</p>
      </div>
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        onClick={onClearSong}
        className="absolute top-2 right-2 h-6 w-6"
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default SelectedSongDisplay;

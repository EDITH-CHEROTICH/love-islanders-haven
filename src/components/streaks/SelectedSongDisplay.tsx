
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SongData {
  title: string;
  artist: string;
  albumArt: string;
  previewUrl: string;
}

export interface SelectedSongDisplayProps {
  selectedSong?: SongData | null;
  onClearSong?: () => void;
  song?: SongData | null;
  onRemoveSong?: () => void;
}

const SelectedSongDisplay: React.FC<SelectedSongDisplayProps> = ({ 
  selectedSong, 
  song,
  onClearSong,
  onRemoveSong
}) => {
  const songData = selectedSong || song;
  
  if (!songData) return null;
  
  const handleRemove = () => {
    if (onRemoveSong) {
      onRemoveSong();
    } else if (onClearSong) {
      onClearSong();
    }
  };
  
  return (
    <div className="p-4 border rounded-lg flex items-center space-x-3 bg-black/20 my-4 relative">
      <img 
        src={songData.albumArt} 
        alt={`${songData.title} album cover`} 
        className="w-12 h-12 rounded-md object-cover"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{songData.title}</h4>
        <p className="text-sm opacity-80 truncate">{songData.artist}</p>
      </div>
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        onClick={handleRemove}
        className="absolute top-2 right-2 h-6 w-6"
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default SelectedSongDisplay;

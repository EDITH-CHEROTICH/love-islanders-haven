
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { SongData } from "./types";
import { useAudioPlayer } from '@/hooks/use-audio-player';

interface SelectedSongDisplayProps {
  song: SongData | null;
  onRemoveSong: () => void;
}

const SelectedSongDisplay = ({ song, onRemoveSong }: SelectedSongDisplayProps) => {
  const { isPlaying, currentSrc, togglePlayPause } = useAudioPlayer();
  
  if (!song) return null;
  
  const handlePlayToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (song.preview_url) {
      togglePlayPause(song.preview_url);
    }
  };
  
  return (
    <div className="flex items-center p-2 rounded-md bg-background border">
      {song.album_art && (
        <img 
          src={song.album_art} 
          alt={`${song.title} album art`} 
          className="w-12 h-12 object-cover rounded-md mr-3" 
        />
      )}
      
      <div className="flex-1">
        <p className="font-medium truncate">{song.title}</p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
      
      <div className="flex gap-2">
        {song.preview_url && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handlePlayToggle}
            className="h-8 w-8"
          >
            <span className="sr-only">
              {isPlaying && currentSrc === song.preview_url ? 'Pause' : 'Play'} preview
            </span>
            {isPlaying && currentSrc === song.preview_url ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </Button>
        )}
        
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onRemoveSong}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <span className="sr-only">Remove song</span>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectedSongDisplay;


import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SongOption } from "./types";
import { Spinner } from "@/components/ui/spinner";
import { Check, Music } from "lucide-react";
import { useAudioPlayer } from '@/hooks/use-audio-player';

interface SongSearchSectionProps {
  showSongInput: boolean;
  songTitle: string;
  isSearching: boolean;
  songOptions: SongOption[];
  onSongTitleChange: (value: string) => void;
  onSongSelect: (id: string) => void;
  onCancelSearch: () => void;
}

const SongSearchSection = ({
  showSongInput,
  songTitle,
  isSearching,
  songOptions,
  onSongTitleChange,
  onSongSelect,
  onCancelSearch
}: SongSearchSectionProps) => {
  const { currentSrc, isPlaying, togglePlayPause } = useAudioPlayer();
  
  if (!showSongInput) return null;
  
  const handlePlayToggle = (e: React.MouseEvent, previewUrl: string | undefined) => {
    e.stopPropagation();
    if (previewUrl) {
      togglePlayPause(previewUrl);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={songTitle}
          onChange={(e) => onSongTitleChange(e.target.value)}
          placeholder="Search for a song..."
          className="flex-1"
        />
        <Button variant="outline" onClick={onCancelSearch}>
          Cancel
        </Button>
      </div>
      
      {isSearching && (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      )}
      
      {songOptions.length > 0 && (
        <ul className="space-y-2 max-h-60 overflow-y-auto rounded-md border">
          {songOptions.map((song) => (
            <li
              key={song.id}
              onClick={() => onSongSelect(song.id)}
              className="flex items-center p-2 hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex-shrink-0 mr-3">
                {song.album_art ? (
                  <img
                    src={song.album_art}
                    alt={`${song.title} album art`}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                    <Music size={16} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.title}</p>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {song.preview_url && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={(e) => handlePlayToggle(e, song.preview_url)}
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
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSongSelect(song.id);
                  }}
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Select song</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongSearchSection;

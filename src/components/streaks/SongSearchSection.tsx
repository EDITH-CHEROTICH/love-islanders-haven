import { Music, Search, X, PlayCircle, PauseCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SongOption } from "./types";
import { useAudioPlayer } from "@/hooks/use-audio-player";

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
  onCancelSearch,
}: SongSearchSectionProps) => {
  const { isPlaying, currentAudioId, playAudio } = useAudioPlayer();

  if (!showSongInput) return null;
  
  const handlePlayPreview = (songId: string, previewUrl?: string) => {
    if (!previewUrl) return;
    playAudio(songId, previewUrl);
  };
  
  return (
    <div className="space-y-3 p-3 border rounded-md">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Music size={16} />
        <span>Search for a song</span>
      </h3>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          placeholder="Search for songs by title"
          value={songTitle}
          onChange={(e) => onSongTitleChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isSearching && (
        <div className="text-center py-2 text-sm text-muted-foreground">
          Searching...
        </div>
      )}
      
      {!isSearching && songOptions.length > 0 && (
        <div className="mt-2 space-y-2">
          {songOptions.map(option => (
            <div 
              key={option.id} 
              className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted"
            >
              <div 
                className="flex items-center flex-1"
                onClick={() => onSongSelect(option.id)}
              >
                <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center mr-3">
                  <Music size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm">{option.title}</p>
                  <p className="text-xs text-muted-foreground">{option.artist}</p>
                </div>
              </div>
              {option.preview_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPreview(option.id, option.preview_url);
                  }}
                >
                  {currentAudioId === option.id && isPlaying ? (
                    <PauseCircle className="h-5 w-5" />
                  ) : (
                    <PlayCircle className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!isSearching && songTitle.trim() && songOptions.length === 0 && (
        <div className="text-center py-2 text-sm text-muted-foreground">
          No songs found. Try a different search term.
        </div>
      )}
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancelSearch}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SongSearchSection;

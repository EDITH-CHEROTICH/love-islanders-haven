
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
        <div className="flex items-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0Z" fill="#1DB954"/>
            <path d="M11.51 11.677C11.384 11.877 11.142 11.935 10.942 11.81C9.08 10.671 6.743 10.412 4.006 11.048C3.782 11.111 3.554 10.981 3.491 10.757C3.428 10.534 3.558 10.306 3.781 10.243C6.783 9.538 9.367 9.84 11.443 11.11C11.643 11.235 11.701 11.477 11.576 11.677H11.51ZM12.499 9.546C12.339 9.796 12.029 9.871 11.779 9.711C9.644 8.382 6.458 7.997 3.9 8.776C3.619 8.856 3.327 8.697 3.247 8.417C3.167 8.136 3.326 7.844 3.607 7.764C6.568 6.873 10.105 7.304 12.559 8.826C12.797 8.974 12.872 9.296 12.724 9.546H12.499ZM12.573 7.366C10.032 5.824 5.846 5.681 3.462 6.462C3.13 6.561 2.781 6.366 2.683 6.033C2.584 5.701 2.78 5.353 3.112 5.254C5.846 4.366 10.428 4.536 13.348 6.309C13.717 6.521 13.827 7.001 13.614 7.358C13.409 7.735 12.93 7.846 12.573 7.634V7.366Z" fill="white"/>
          </svg>
          <span>Search Spotify for a song</span>
        </div>
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
          Searching Spotify...
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
                {option.album_art ? (
                  <img 
                    src={option.album_art} 
                    alt={`Album art for ${option.title}`}
                    className="h-10 w-10 rounded-md object-cover mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center mr-3">
                    <Music size={16} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{option.title}</p>
                  <p className="text-xs text-muted-foreground">{option.artist}</p>
                </div>
              </div>
              {option.preview_url ? (
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
              ) : (
                <div className="text-xs text-muted-foreground px-2">No preview</div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!isSearching && songTitle.trim() && songOptions.length === 0 && (
        <div className="text-center py-2 text-sm text-muted-foreground">
          No songs found on Spotify. Try a different search term.
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

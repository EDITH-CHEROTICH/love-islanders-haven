
import { Music, X, PlayCircle, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongData } from "./types";
import useAudioPlayer from "@/hooks/use-audio-player";

interface SelectedSongDisplayProps {
  song: SongData | null;
  onRemoveSong: () => void;
}

const SelectedSongDisplay = ({ song, onRemoveSong }: SelectedSongDisplayProps) => {
  const { isPlaying, currentAudioId, playAudio } = useAudioPlayer();

  if (!song) return null;
  
  const handlePlayPause = () => {
    if (!song.preview_url) return;
    playAudio('selected-song', song.preview_url);
  };
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
          <Music size={16} />
        </div>
        <div>
          <p className="font-medium text-sm">{song.title}</p>
          <p className="text-xs text-muted-foreground">{song.artist}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {song.preview_url && (
          <Button type="button" variant="ghost" size="sm" onClick={handlePlayPause}>
            {currentAudioId === 'selected-song' && isPlaying ? (
              <PauseCircle size={16} />
            ) : (
              <PlayCircle size={16} />
            )}
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={onRemoveSong}>
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SelectedSongDisplay;

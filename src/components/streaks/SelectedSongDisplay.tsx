
import { Music, X, PlayCircle, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongData } from "./types";
import { useState, useRef, useEffect } from "react";

interface SelectedSongDisplayProps {
  song: SongData | null;
  onRemoveSong: () => void;
}

const SelectedSongDisplay = ({ song, onRemoveSong }: SelectedSongDisplayProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!song) return null;
  
  const handlePlayPause = () => {
    if (!song.preview_url) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(song.preview_url);
        audioRef.current.volume = 0.5;
        
        // Set up ended event to reset the playing state
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
      
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
      
      setIsPlaying(true);
    }
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
            {isPlaying ? (
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

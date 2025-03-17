
import { Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongData } from "./types";

interface SelectedSongDisplayProps {
  song: SongData | null;
  onRemoveSong: () => void;
}

const SelectedSongDisplay = ({ song, onRemoveSong }: SelectedSongDisplayProps) => {
  if (!song) return null;
  
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
      <Button type="button" variant="ghost" size="sm" onClick={onRemoveSong}>
        <X size={16} />
      </Button>
    </div>
  );
};

export default SelectedSongDisplay;

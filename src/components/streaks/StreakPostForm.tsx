
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Music, Search } from "lucide-react";
import { SongData, SongOption } from "./types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface StreakPostFormProps {
  onSubmit: (data: { content: string; caption?: string; song?: SongData }) => void;
  onCancel: () => void;
}

const StreakPostForm = ({ onSubmit, onCancel }: StreakPostFormProps) => {
  const [content, setContent] = useState<string>("/placeholder.svg"); // For demo purposes, using placeholder
  const [caption, setCaption] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSongInput, setShowSongInput] = useState(false);
  const [song, setSong] = useState<SongData | null>(null);
  const [songTitle, setSongTitle] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [songOptions, setSongOptions] = useState<SongOption[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string>("");
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // In a real implementation, you would upload the file to storage here
      // For now, we'll just create a local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setContent("/placeholder.svg"); // In real implementation, this would be the URL from storage
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      content, 
      caption,
      song: song || undefined
    });
  };

  const handleSongAdd = () => {
    if (!showSongInput) {
      setShowSongInput(true);
      return;
    }
  };

  const searchSongs = (title: string) => {
    if (!title.trim()) {
      setSongOptions([]);
      return;
    }

    setIsSearching(true);
    
    // In a real implementation, this would call a music API
    // For demo purposes, we'll create some dummy results
    setTimeout(() => {
      const dummyResults: SongOption[] = [
        {
          id: "1",
          title: title,
          artist: "Taylor Swift",
          album_art: "/placeholder.svg"
        },
        {
          id: "2",
          title: title,
          artist: "Ed Sheeran",
          album_art: "/placeholder.svg"
        },
        {
          id: "3",
          title: title,
          artist: "Beyoncé",
          album_art: "/placeholder.svg"
        },
        {
          id: "4",
          title: title,
          artist: "Drake",
          album_art: "/placeholder.svg"
        },
        {
          id: "5",
          title: title,
          artist: "The Weeknd",
          album_art: "/placeholder.svg"
        }
      ];
      
      setSongOptions(dummyResults);
      setIsSearching(false);
    }, 500);
  };

  // Debounce the search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (songTitle.trim()) {
        searchSongs(songTitle);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [songTitle]);

  const handleSongSelect = (id: string) => {
    const selectedSong = songOptions.find(song => song.id === id);
    if (selectedSong) {
      setSong({
        title: selectedSong.title,
        artist: selectedSong.artist,
        album_art: selectedSong.album_art,
        preview_url: selectedSong.preview_url
      });
      setShowSongInput(false);
      toast({
        title: "Song added",
        description: `${selectedSong.title} by ${selectedSong.artist} added to your post`,
      });
    }
  };

  const removeSong = () => {
    setSong(null);
    setSongTitle("");
    setSongOptions([]);
    setSelectedSongId("");
    setShowSongInput(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-md overflow-hidden relative">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full aspect-square object-cover"
            />
            <button 
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-2">
              Snap a photo for your streak
            </p>
            <Button 
              type="button"
              variant="outline"
              className="relative overflow-hidden"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Select Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="caption" className="block text-sm font-medium mb-1">
          Caption (optional)
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
          placeholder="Add a caption to your streak post..."
        />
      </div>
      
      {!song && !showSongInput && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSongAdd}
          className="flex items-center gap-2 w-full"
        >
          <Music size={16} />
          <span>Add a song</span>
        </Button>
      )}

      {showSongInput && (
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
              onChange={(e) => setSongTitle(e.target.value)}
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
                  className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-muted"
                  onClick={() => handleSongSelect(option.id)}
                >
                  <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center mr-3">
                    <Music size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{option.title}</p>
                    <p className="text-xs text-muted-foreground">{option.artist}</p>
                  </div>
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
            <Button type="button" variant="outline" size="sm" onClick={() => setShowSongInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {song && (
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
          <Button type="button" variant="ghost" size="sm" onClick={removeSong}>
            <X size={16} />
          </Button>
        </div>
      )}
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!previewUrl && !content}
        >
          Post Streak
        </Button>
      </div>
    </form>
  );
};

export default StreakPostForm;

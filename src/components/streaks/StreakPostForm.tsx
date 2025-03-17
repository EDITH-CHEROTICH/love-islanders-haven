
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { SongData, SongOption } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadSection from "./ImageUploadSection";
import SongSearchSection from "./SongSearchSection";
import SelectedSongDisplay from "./SelectedSongDisplay";
import FormControls from "./FormControls";

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
      <ImageUploadSection
        previewUrl={previewUrl}
        isUploading={isUploading}
        onImageSelect={handleImageSelect}
        onClearPreview={() => setPreviewUrl(null)}
      />
      
      <div>
        <label htmlFor="caption" className="block text-sm font-medium mb-1">
          Caption (optional)
        </label>
        <Textarea
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

      <SongSearchSection
        showSongInput={showSongInput}
        songTitle={songTitle}
        isSearching={isSearching}
        songOptions={songOptions}
        onSongTitleChange={setSongTitle}
        onSongSelect={handleSongSelect}
        onCancelSearch={() => setShowSongInput(false)}
      />

      <SelectedSongDisplay
        song={song}
        onRemoveSong={removeSong}
      />
      
      <FormControls
        onCancel={onCancel}
        isSubmitDisabled={!previewUrl && !content}
      />
    </form>
  );
};

export default StreakPostForm;

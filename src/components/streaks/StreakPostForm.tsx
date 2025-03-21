
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { SongData } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadSection from "./ImageUploadSection";
import SongSearchSection from "./SongSearchSection";
import SelectedSongDisplay from "./SelectedSongDisplay";
import FormControls from "./FormControls";
import useSongSearch from "@/hooks/use-song-search";
import { Slider } from "@/components/ui/slider";

interface StreakPostFormProps {
  onSubmit: (data: { content: string; caption?: string; song?: SongData; duration?: number }) => void;
  onCancel: () => void;
}

const StreakPostForm = ({ onSubmit, onCancel }: StreakPostFormProps) => {
  const [content, setContent] = useState<string>("https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80");
  const [caption, setCaption] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSongInput, setShowSongInput] = useState(false);
  const [song, setSong] = useState<SongData | null>(null);
  const [duration, setDuration] = useState<number>(24); // Default to 24 hours
  const { toast } = useToast();
  
  // Use our custom hook for song search
  const { songTitle, setSongTitle, isSearching, songOptions, clearSearch } = useSongSearch();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // In a real implementation, you would upload the file to storage here
      // For now, we'll just create a local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setContent("https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"); // Demo image URL
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) {
      toast({
        title: "Missing content",
        description: "Please select an image for your streak post.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({ 
      content, 
      caption: caption || undefined,
      song: song || undefined,
      duration: duration
    });
  };

  const handleSongAdd = () => {
    if (!showSongInput) {
      setShowSongInput(true);
      return;
    }
  };

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
      clearSearch();
      toast({
        title: "Song added",
        description: `${selectedSong.title} by ${selectedSong.artist} added to your post`,
      });
    }
  };

  const removeSong = () => {
    setSong(null);
    clearSearch();
    setShowSongInput(false);
  };

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Streak Duration: {duration} {duration === 1 ? 'hour' : 'hours'}
        </label>
        <Slider 
          defaultValue={[24]} 
          max={24} 
          min={1} 
          step={1} 
          onValueChange={handleDurationChange}
        />
        <p className="text-xs text-muted-foreground">
          Your streak will expire after {duration} {duration === 1 ? 'hour' : 'hours'} if not renewed.
        </p>
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
        isSubmitDisabled={!content}
      />
    </form>
  );
};

export default StreakPostForm;

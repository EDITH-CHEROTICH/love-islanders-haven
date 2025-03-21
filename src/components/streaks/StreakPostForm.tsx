
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
  onSubmit: (data: { content: string; caption?: string; song?: SongData; duration?: number }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const StreakPostForm = ({ onSubmit, onCancel, isSubmitting = false }: StreakPostFormProps) => {
  const [content, setContent] = useState<string>("");
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
      
      // Create a data URL for preview and storage
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setPreviewUrl(imageUrl);
        // Set the content to the image data URL
        setContent(imageUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) {
      toast({
        title: "Missing content",
        description: "Please select an image for your streak post.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Log the submission data for debugging
      console.log("Submitting with content length:", content.length);
      
      const success = await onSubmit({ 
        content, 
        caption: caption || undefined,
        song: song || undefined,
        duration: duration
      });
      
      if (success) {
        // Reset form state - this will be handled by the parent component
        // because it will hide the form on successful submission
        console.log("Form submitted successfully");
      } else {
        toast({
          title: "Error",
          description: "Failed to post your streak. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({
        title: "Error",
        description: "Failed to post your streak. Please try again.",
        variant: "destructive",
      });
    }
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
        onClearPreview={() => {
          setPreviewUrl(null);
          setContent("");
        }}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
        isSubmitDisabled={!content || isUploading}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default StreakPostForm;

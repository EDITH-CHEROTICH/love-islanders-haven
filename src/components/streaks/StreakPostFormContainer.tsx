
import { useState } from "react";
import { Music } from "lucide-react";
import { SongData } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ImageUploadSection from "./ImageUploadSection";
import SongSearchSection from "./SongSearchSection";
import SelectedSongDisplay from "./SelectedSongDisplay";
import FormControls from "./FormControls";
import CaptionInput from "./CaptionInput";
import DurationSelector from "./DurationSelector";
import useSongSearch from "@/hooks/use-song-search";

interface StreakPostFormContainerProps {
  onSubmit: (data: { content: string; caption?: string; song?: SongData; duration?: number }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const StreakPostFormContainer = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: StreakPostFormContainerProps) => {
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
      console.log("Form submission started with content length:", content.length);
      
      // Call the onSubmit function passed from parent component
      const success = await onSubmit({ 
        content, 
        caption: caption || undefined,
        song: song || undefined,
        duration: duration
      });
      
      if (success) {
        // Reset form state on successful submission
        console.log("Form submitted successfully");
        setContent("");
        setCaption("");
        setPreviewUrl(null);
        setSong(null);
        setDuration(24);
      } else {
        console.error("Form submission failed");
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
      
      <CaptionInput 
        caption={caption}
        onCaptionChange={setCaption}
        disabled={isSubmitting}
      />

      <DurationSelector
        duration={duration}
        onDurationChange={handleDurationChange}
        disabled={isSubmitting}
      />
      
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

export default StreakPostFormContainer;

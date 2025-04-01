
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
import MultiImagePreview from "./MultiImagePreview";
import useImageUpload from "./hooks/useImageUpload";
import SongSelectionArea from "./SongSelectionArea";

interface StreakPostFormContainerProps {
  onSubmit: (data: { content: string[]; caption?: string; song?: SongData; duration?: number }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const StreakPostFormContainer = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: StreakPostFormContainerProps) => {
  const [caption, setCaption] = useState<string>("");
  const [showSongInput, setShowSongInput] = useState(false);
  const [song, setSong] = useState<SongData | null>(null);
  const [duration, setDuration] = useState<number>(24); // Default to 24 hours
  const { toast } = useToast();
  
  // Use our custom hooks
  const { 
    content, 
    previewUrls, 
    isUploading, 
    handleImageSelect, 
    removeImage, 
    clearImages 
  } = useImageUpload(toast);
  
  const { 
    songTitle, 
    setSongTitle, 
    isSearching, 
    songOptions, 
    clearSearch 
  } = useSongSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.length === 0) {
      toast.toast({
        title: "Missing content",
        description: "Please select at least one image for your streak post.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Form submission started with content length:", content.length);
      
      // Call the onSubmit function passed from parent component
      const success = await onSubmit({ 
        content, 
        caption: caption || undefined,
        song: song || undefined,
        duration: duration
      });
      
      if (success) {
        console.log("Form submitted successfully");
        clearImages();
        setCaption("");
        setSong(null);
        setDuration(24);
      } else {
        console.error("Form submission failed");
        toast.toast({
          title: "Error",
          description: "Failed to post your streak. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.toast({
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
        albumArt: selectedSong.album_art || '',
        previewUrl: selectedSong.preview_url || ''
      });
      setShowSongInput(false);
      clearSearch();
      toast.toast({
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
        previewUrls={previewUrls}
        isUploading={isUploading}
        onImageSelect={handleImageSelect}
        onClearPreview={clearImages}
        onRemoveImage={removeImage}
        imageCount={previewUrls.length}
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
      
      <SongSelectionArea 
        song={song}
        showSongInput={showSongInput}
        songTitle={songTitle}
        setSongTitle={setSongTitle}
        isSearching={isSearching}
        songOptions={songOptions}
        isSubmitting={isSubmitting}
        onSongAdd={handleSongAdd}
        onSongSelect={handleSongSelect}
        onCancelSearch={() => setShowSongInput(false)}
        onRemoveSong={removeSong}
        clearSearch={clearSearch}
      />
      
      <FormControls
        onCancel={onCancel}
        isSubmitDisabled={content.length === 0 || isUploading}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default StreakPostFormContainer;

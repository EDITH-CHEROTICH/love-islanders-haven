
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ImageUploadSection from "./ImageUploadSection";
import FormControls from "./FormControls";
import DurationSelector from "./DurationSelector";
import useImageUpload from "./hooks/useImageUpload";

interface StreakPostFormContainerProps {
  onSubmit: (data: { content: string[]; duration?: number }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const StreakPostFormContainer = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: StreakPostFormContainerProps) => {
  const [duration, setDuration] = useState<number>(24); // Default to 24 hours
  const [localSubmitting, setLocalSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Use our custom hooks
  const { 
    content, 
    previewUrls, 
    isUploading, 
    handleImageSelect, 
    removeImage, 
    clearImages 
  } = useImageUpload({ toast });

  // Update local submitting state when parent prop changes
  useEffect(() => {
    setLocalSubmitting(isSubmitting);
  }, [isSubmitting]);

  // Debug the form state
  useEffect(() => {
    console.log("Form state updated:", { 
      contentLength: content.length, 
      isUploading,
      localSubmitting,
      parentIsSubmitting: isSubmitting,
      previewUrlsLength: previewUrls.length
    });
  }, [content, isUploading, localSubmitting, isSubmitting, previewUrls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.length === 0) {
      toast({
        title: "Missing content",
        description: "Please select at least one image for your streak post.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Form submission started with content length:", content.length);
      setLocalSubmitting(true);
      
      // Create a deep copy of the content to prevent any reference issues
      const submissionData = { 
        content: [...content],
        duration: duration
      };
      
      console.log("Submitting data:", {
        contentLength: submissionData.content.length,
        duration: submissionData.duration
      });
      
      // Call the onSubmit function passed from parent component
      try {
        const success = await onSubmit(submissionData);
        
        if (success) {
          console.log("Form submitted successfully");
          clearImages();
          setDuration(24);
          toast({
            title: "Success",
            description: "Your streak has been posted successfully!",
          });
        } else {
          console.error("Form submission failed");
          toast({
            title: "Error",
            description: "Failed to post your streak. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error from onSubmit function:", error);
        toast({
          title: "Error",
          description: "An error occurred while posting your streak.",
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
    } finally {
      setLocalSubmitting(false);
    }
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

      <DurationSelector
        duration={duration}
        onDurationChange={handleDurationChange}
        disabled={localSubmitting || isSubmitting}
      />
      
      <FormControls
        onCancel={onCancel}
        isSubmitDisabled={content.length === 0 || isUploading}
        isSubmitting={localSubmitting || isSubmitting}
      />
    </form>
  );
};

export default StreakPostFormContainer;

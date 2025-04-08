
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseImageUploadProps {
  toast: ReturnType<typeof useToast>["toast"];
}

interface UseImageUploadReturn {
  content: string[];
  previewUrls: string[];
  isUploading: boolean;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
}

const useImageUpload = ({ toast }: UseImageUploadProps): UseImageUploadReturn => {
  const [content, setContent] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Debug state changes
  useEffect(() => {
    console.log("Image upload state:", {
      contentLength: content.length,
      previewUrlsLength: previewUrls.length,
      isUploading
    });
  }, [content, previewUrls, isUploading]);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log("No files selected");
      return;
    }
    
    // Check if adding new files would exceed the limit
    if (previewUrls.length + files.length > 10) {
      toast({
        title: "Too many images",
        description: "You can only upload up to 10 images for a streak post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    console.log("Starting image upload process for", files.length, "files");
    
    // Process each file
    const newImages: string[] = [];
    const fileCount = files.length;
    let processed = 0;
    
    Array.from(files).forEach(file => {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        console.error("File is not an image:", file.name, file.type);
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        processed++;
        checkAllProcessed();
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result) {
          const imageUrl = reader.result.toString();
          newImages.push(imageUrl);
          processed++;
          
          console.log(`Processed ${processed} of ${fileCount} images`);
          
          // When all files are processed, update state
          if (processed === fileCount) {
            console.log("All images processed, updating state with", newImages.length, "new images");
            setPreviewUrls(prev => {
              const updatedPreviews = [...prev, ...newImages];
              setContent(updatedPreviews); // Ensure content and previewUrls stay in sync
              return updatedPreviews;
            });
            setIsUploading(false);
          }
        } else {
          console.error("Error reading file: null result");
          processed++;
          checkAllProcessed();
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        processed++;
        checkAllProcessed();
        
        toast({
          title: "Error",
          description: `Failed to process image: ${file.name}`,
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    });
    
    // Helper function to check if all files have been processed
    function checkAllProcessed() {
      if (processed === fileCount) {
        setIsUploading(false);
        if (newImages.length > 0) {
          setPreviewUrls(prev => {
            const updatedPreviews = [...prev, ...newImages];
            setContent(updatedPreviews); // Keep in sync
            return updatedPreviews;
          });
        }
      }
    }
  };

  const removeImage = (index: number) => {
    console.log("Removing image at index", index);
    setPreviewUrls(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setContent(updated); // Keep in sync
      return updated;
    });
  };

  const clearImages = () => {
    console.log("Clearing all images");
    setPreviewUrls([]);
    setContent([]);
  };

  return {
    content,
    previewUrls,
    isUploading,
    handleImageSelect,
    removeImage,
    clearImages
  };
};

export default useImageUpload;


import { useState } from "react";
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
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
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
      const reader = new FileReader();
      
      reader.onload = () => {
        const imageUrl = reader.result as string;
        newImages.push(imageUrl);
        processed++;
        
        console.log(`Processed ${processed} of ${fileCount} images`);
        
        // When all files are processed, update state
        if (processed === fileCount) {
          console.log("All images processed, updating state with", newImages.length, "new images");
          setPreviewUrls(prev => [...prev, ...newImages]);
          setContent(prev => [...prev, ...newImages]);
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        processed++;
        
        if (processed === fileCount) {
          setIsUploading(false);
          if (newImages.length > 0) {
            setPreviewUrls(prev => [...prev, ...newImages]);
            setContent(prev => [...prev, ...newImages]);
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    console.log("Removing image at index", index);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setContent(prev => prev.filter((_, i) => i !== index));
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

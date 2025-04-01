
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseImageUploadReturn {
  content: string[];
  previewUrls: string[];
  isUploading: boolean;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
}

const useImageUpload = (toast: ReturnType<typeof useToast>): UseImageUploadReturn => {
  const [content, setContent] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding new files would exceed the limit
    if (previewUrls.length + files.length > 10) {
      toast.toast({
        title: "Too many images",
        description: "You can only upload up to 10 images for a streak post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Process each file
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        
        setPreviewUrls(prev => [...prev, imageUrl]);
        setContent(prev => [...prev, imageUrl]);
        
        // When all files are processed
        if (previewUrls.length + 1 >= files.length) {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setContent(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
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

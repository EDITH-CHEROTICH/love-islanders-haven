
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface ImageUploadSectionProps {
  previewUrl: string | null;
  isUploading: boolean;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPreview: () => void;
}

const ImageUploadSection = ({
  previewUrl,
  isUploading,
  onImageSelect,
  onClearPreview,
}: ImageUploadSectionProps) => {
  // Demo image to show when there's no preview
  const demoImage = "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80";
  
  return (
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
            onClick={onClearPreview}
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
          <div className="w-full max-w-[200px] mb-4">
            <img 
              src={demoImage} 
              alt="Demo Image" 
              className="w-full rounded-md opacity-70"
            />
          </div>
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
              onChange={onImageSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;

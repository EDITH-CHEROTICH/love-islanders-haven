
import { Button } from "@/components/ui/button";
import { Camera, X, Upload, Loader2 } from "lucide-react";

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
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-2">
            Select a photo for your streak
          </p>
          <Button 
            type="button"
            variant="outline"
            className="relative overflow-hidden flex items-center gap-2"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Choose Image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;

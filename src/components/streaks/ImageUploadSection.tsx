
import { Button } from "@/components/ui/button";
import { Camera, X, Upload, Loader2, Plus } from "lucide-react";
import MultiImagePreview from "./MultiImagePreview";

interface ImageUploadSectionProps {
  previewUrls: string[];
  isUploading: boolean;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPreview: () => void;
  onRemoveImage: (index: number) => void;
  imageCount: number;
}

const ImageUploadSection = ({
  previewUrls,
  isUploading,
  onImageSelect,
  onClearPreview,
  onRemoveImage,
  imageCount,
}: ImageUploadSectionProps) => {
  const MAX_IMAGES = 10;
  
  return (
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md overflow-hidden relative">
      {previewUrls.length > 0 ? (
        <div className="relative">
          <MultiImagePreview 
            images={previewUrls} 
            onRemoveImage={onRemoveImage} 
            isUploading={isUploading}
          />
          
          {previewUrls.length < MAX_IMAGES && (
            <div className="p-2 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {previewUrls.length} of {MAX_IMAGES} images
              </p>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                className="relative overflow-hidden"
                disabled={isUploading}
              >
                <Plus size={16} className="mr-1" />
                <span>Add More</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading}
                  multiple
                />
              </Button>
            </div>
          )}
          
          {previewUrls.length > 1 && (
            <Button 
              type="button"
              onClick={onClearPreview}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
              size="icon"
              variant="ghost"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-2">
            Select photos for your streak (up to 10)
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
                <span>Choose Images</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
              multiple
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;

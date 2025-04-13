
import { Upload, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfileImageGridProps {
  images: string[];
  visibleImages: number[];
  maxImages: number;
  onImageUploaded: (file: File) => Promise<string | null>;
  onRemoveImage: (index: number) => void;
  onToggleVisibility: (index: number) => void;
  onMoveImageUp: (index: number) => void;
  onMoveImageDown: (index: number) => void;
}

const ProfileImageGrid = ({
  images,
  visibleImages,
  maxImages,
  onImageUploaded,
  onRemoveImage,
  onToggleVisibility,
  onMoveImageUp,
  onMoveImageDown
}: ProfileImageGridProps) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, WebP or GIF image.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File is too large. Please upload an image smaller than 5MB.");
      return;
    }

    try {
      await onImageUploaded(file);
      
      // Clear the input value to allow uploading the same file again
      e.target.value = '';
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-island-light/20 group">
          <img 
            src={image} 
            alt={`Profile image ${index + 1}`}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveImage(index)}
                className="flex items-center gap-1"
              >
                <Trash2 size={14} />
                Remove
              </Button>
              
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onMoveImageUp(index)}
                  disabled={index === 0}
                  className="h-8 w-8 bg-island-light/30"
                >
                  <ChevronUp size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onMoveImageDown(index)}
                  disabled={index === images.length - 1}
                  className="h-8 w-8 bg-island-light/30"
                >
                  <ChevronDown size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onToggleVisibility(index)}
                  className="h-8 w-8 bg-island-light/30"
                >
                  {visibleImages.includes(index) ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {images.length < maxImages && (
        <div className="relative aspect-square rounded-lg border-2 border-dashed border-island-light/50 flex flex-col items-center justify-center p-4">
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="sr-only"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-8 w-8 mb-2 text-island-light/70" />
            <span className="text-sm text-island-light/70 text-center">
              Upload Image
            </span>
            <span className="text-xs text-island-light/50 text-center mt-1">
              (JPEG, PNG, WebP or GIF)
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default ProfileImageGrid;

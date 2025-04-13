
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  disabled?: boolean;
}

const ImageUploader = ({ onImageUploaded, disabled = false }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

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

    setIsUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // TODO: Upload image and get URL
      // For now, just simulate an upload delay and use a dummy URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);

      // Clear the input value to allow uploading the same file again
      e.target.value = '';

      // Call callback with image URL
      onImageUploaded(imageUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="image-upload"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isUploading || disabled}
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer"
      >
        <Button
          variant="outline"
          className={`w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isUploading || disabled}
          type="button"
        >
          {isUploading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </span>
          )}
        </Button>
      </label>
    </div>
  );
};

export default ImageUploader;

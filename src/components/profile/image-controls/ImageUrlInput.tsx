
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUrlInputProps {
  maxImages: number;
  currentImagesCount: number;
  onAddImage: (url: string) => void;
  isSubmitting: boolean;
}

const ImageUrlInput = ({
  maxImages,
  currentImagesCount,
  onAddImage,
  isSubmitting
}: ImageUrlInputProps) => {
  const [imageUrl, setImageUrl] = useState('');
  
  // Basic URL validation
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      try {
        new URL('https://' + url);
        return true;
      } catch (_) {
        return false;
      }
    }
  };
  
  // Check if the URL is an image (basic check for common extensions)
  const isImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('image') ||
           lowerUrl.includes('photo');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }
    
    // Validate URL format
    if (!isValidUrl(imageUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    // Basic check if it might be an image
    if (!isImageUrl(imageUrl)) {
      toast.warning("URL doesn't appear to be an image. Make sure it points to a JPG, PNG or other image format.");
    }
    
    // Basic URL correction
    let finalUrl = imageUrl.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }
    
    onAddImage(finalUrl);
    setImageUrl('');
    toast.success("Image URL added");
  };
  
  if (currentImagesCount >= maxImages) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="flex-1 bg-island-light/20 border-island-light"
        disabled={isSubmitting}
      />
      <Button 
        type="submit"
        disabled={isSubmitting || !imageUrl.trim()}
        variant="outline"
        className="bg-island-light/20 border-island-light"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
          </>
        )}
      </Button>
    </form>
  );
};

export default ImageUrlInput;

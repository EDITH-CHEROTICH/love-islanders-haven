
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, PlusCircle } from 'lucide-react';

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)/i;
    if (!urlPattern.test(imageUrl)) {
      const correctedUrl = `https://${imageUrl}`;
      onAddImage(correctedUrl.trim());
    } else {
      onAddImage(imageUrl.trim());
    }
    
    setImageUrl('');
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

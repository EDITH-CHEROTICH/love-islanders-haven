
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  const handleAddImage = async () => {
    if (!newImageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL.",
        variant: "destructive",
      });
      return;
    }

    if (currentImagesCount >= maxImages) {
      toast({
        title: "Error",
        description: `You can only have up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    // Simple URL validation
    if (!newImageUrl.match(/^https?:\/\/.+\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i)) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL (JPEG, PNG, GIF, WEBP).",
        variant: "destructive",
      });
      return;
    }

    onAddImage(newImageUrl);
    setNewImageUrl('');
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
        placeholder="Or enter image URL"
        className="flex-1 bg-island-dark border-island-light border px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-love"
        disabled={isSubmitting}
      />
      <button
        onClick={handleAddImage}
        disabled={currentImagesCount >= maxImages || !newImageUrl || isSubmitting}
        className="bg-love hover:bg-love-light text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Adding...' : (
          <>
            <Plus size={16} />
            <span>Add</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ImageUrlInput;

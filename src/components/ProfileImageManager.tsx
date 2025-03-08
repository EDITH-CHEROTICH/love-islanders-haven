
import { useState } from 'react';
import { Image, Plus, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageManagerProps {
  images: string[];
  verified: boolean;
  onImagesChange: (images: string[]) => void;
  onVerificationRequest: () => void;
}

const ProfileImageManager = ({ 
  images, 
  verified, 
  onImagesChange, 
  onVerificationRequest 
}: ProfileImageManagerProps) => {
  const { toast } = useToast();
  const [newImageUrl, setNewImageUrl] = useState('');
  const maxImages = 6;
  const minImages = 2;

  const handleAddImage = () => {
    if (!newImageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL.",
        variant: "destructive",
      });
      return;
    }

    if (images.length >= maxImages) {
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

    onImagesChange([...images, newImageUrl]);
    setNewImageUrl('');
    
    toast({
      title: "Success",
      description: "Image added successfully.",
    });
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= minImages) {
      toast({
        title: "Error",
        description: `You must have at least ${minImages} images.`,
        variant: "destructive",
      });
      return;
    }

    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    
    toast({
      title: "Success",
      description: "Image removed successfully.",
    });
  };

  const handleVerificationRequest = () => {
    onVerificationRequest();
    toast({
      title: "Verification Requested",
      description: "Your verification request has been submitted. We'll review it soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-love">Profile Images</h2>
        <div className="text-xs text-muted-foreground">
          {images.length}/{maxImages} images
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
            <img 
              src={image} 
              alt={`Profile image ${i+1}`}
              className="w-full h-full object-cover" 
            />
            <button 
              className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(i)}
              aria-label="Remove image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-muted-foreground" />
              <span className="mt-2 block text-xs text-muted-foreground">Add Image</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 bg-island-dark border-island-light border px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-love"
          />
          <button
            onClick={handleAddImage}
            disabled={images.length >= maxImages}
            className="bg-love hover:bg-love-light text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          You must have at least {minImages} images and can add up to {maxImages} images.
        </div>
      </div>
      
      <div className="pt-4 border-t border-island-light">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              {verified ? (
                <>
                  <ShieldCheck size={18} className="text-green-400" />
                  <span>Verified Profile</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={18} className="text-yellow-400" />
                  <span>Unverified Profile</span>
                </>
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {verified 
                ? "Your profile has been verified. This helps others trust you're a real person."
                : "Get verified to let others know you're a real person."}
            </p>
          </div>
          
          {!verified && (
            <button
              onClick={handleVerificationRequest}
              className="bg-love/20 hover:bg-love/30 text-love-light px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition-colors"
            >
              <ShieldCheck size={16} />
              <span>Verify</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageManager;

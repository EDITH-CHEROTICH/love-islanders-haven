import { useState } from 'react';
import { Image, Plus, Trash2, ShieldCheck, ShieldAlert, ArrowUp, ArrowDown, EyeOff, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveProfileImage } from '@/services/profiles/media';
import VerificationPopup from '../verification/VerificationPopup';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import ProfileImageUploader from './ProfileImageUploader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const { user } = useAuth();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [visibleImages, setVisibleImages] = useState<number[]>(Array.from({ length: images.length }, (_, i) => i));
  const maxImages = 6;
  const minImages = 2;

  const handleAddImage = async () => {
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

    setIsSubmitting(true);

    try {
      // Save to Supabase - position is the current length of the images array
      await saveProfileImage(newImageUrl, images.length);
      
      // Update local state
      onImagesChange([...images, newImageUrl]);
      setNewImageUrl('');
      
      toast({
        title: "Success",
        description: "Image added successfully.",
      });
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

    // Note: Currently we don't have a delete operation in our service
    // In a complete implementation, we would add that functionality
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    
    toast({
      title: "Success",
      description: "Image removed successfully.",
    });
  };

  const handleVerificationRequest = () => {
    setVerificationOpen(true);
  };
  
  const handleVerificationSuccess = async () => {
    // Call the onVerificationRequest callback to update parent components
    onVerificationRequest();
    
    toast({
      title: "Verification Complete",
      description: "Your profile is now verified. This helps others trust you're a real person.",
    });
  };

  const handleImageUploaded = (imageUrl: string) => {
    onImagesChange([...images, imageUrl]);
  };

  const toggleImageVisibility = (index: number) => {
    setVisibleImages(prev => {
      if (prev.includes(index)) {
        // Don't allow hiding all images
        if (prev.length <= 1) {
          toast({
            title: "Error",
            description: "You must have at least one visible image",
            variant: "destructive",
          });
          return prev;
        }
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const moveImageUp = async (index: number) => {
    if (index === 0) return;
    
    try {
      setIsSubmitting(true);
      
      // Swap images in the array
      const newImages = [...images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      
      // Update the positions in the database
      await saveProfileImage(newImages[index - 1], index - 1);
      await saveProfileImage(newImages[index], index);
      
      // Update local state
      onImagesChange(newImages);
      
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveImageDown = async (index: number) => {
    if (index === images.length - 1) return;
    
    try {
      setIsSubmitting(true);
      
      // Swap images in the array
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      
      // Update the positions in the database
      await saveProfileImage(newImages[index], index);
      await saveProfileImage(newImages[index + 1], index + 1);
      
      // Update local state
      onImagesChange(newImages);
      
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              className={`w-full h-full object-cover ${!visibleImages.includes(i) ? 'opacity-50' : ''}`}
            />
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <button 
                className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(i)}
                aria-label="Remove image"
              >
                <Trash2 size={16} />
              </button>
              <button 
                className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => toggleImageVisibility(i)}
                aria-label={visibleImages.includes(i) ? "Hide image" : "Show image"}
              >
                {visibleImages.includes(i) ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div className="absolute bottom-2 right-2 flex flex-col gap-1">
              {i > 0 && (
                <button
                  className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => moveImageUp(i)}
                  aria-label="Move image up"
                >
                  <ArrowUp size={16} />
                </button>
              )}
              {i < images.length - 1 && (
                <button
                  className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => moveImageDown(i)}
                  aria-label="Move image down"
                >
                  <ArrowDown size={16} />
                </button>
              )}
            </div>
            {i === 0 && (
              <div className="absolute top-2 left-2 bg-love/80 text-white text-xs px-2 py-1 rounded-md">
                Primary
              </div>
            )}
            {!visibleImages.includes(i) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <EyeOff size={24} className="text-white" />
              </div>
            )}
          </div>
        ))}
        
        {images.length < maxImages && (
          <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
            <div className="text-center p-4">
              <ProfileImageUploader 
                onImageUploaded={handleImageUploaded}
                position={images.length}
              />
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
            placeholder="Or enter image URL"
            className="flex-1 bg-island-dark border-island-light border px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-love"
            disabled={isSubmitting}
          />
          <button
            onClick={handleAddImage}
            disabled={images.length >= maxImages || !newImageUrl || isSubmitting}
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
      
      {/* Verification Popup */}
      {user && (
        <VerificationPopup
          open={verificationOpen}
          onClose={() => setVerificationOpen(false)}
          onVerified={handleVerificationSuccess}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default ProfileImageManager;

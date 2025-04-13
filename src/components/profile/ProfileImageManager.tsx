
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import VerificationPopup from '../verification/VerificationPopup';
import ProfileImageGrid from './image-controls/ProfileImageGrid';
import ImageUrlInput from './image-controls/ImageUrlInput';
import VerificationSection from './verification/VerificationSection';
import { uploadProfileImage } from '@/services/profiles/image-upload';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const minImages = 2;
  const maxImages = 6;
  
  const handleAddImage = async (url: string) => {
    if (images.length >= maxImages) {
      toast.error(`You can only have up to ${maxImages} images.`);
      return;
    }
    
    if (!url) {
      toast.error('Please enter a valid image URL');
      return;
    }
    
    try {
      setUploadingImage(true);
      
      // Add image to profile
      const newImages = [...images, url];
      onImagesChange(newImages);
      
      setImageInput('');
      toast.success('Image added successfully');
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    if (images.length <= minImages) {
      toast.error(`You must have at least ${minImages} images.`);
      return;
    }
    
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    toast.success('Image removed successfully');
  };
  
  const handleImageUploaded = async (file: File) => {
    if (images.length >= maxImages) {
      toast.error(`You can only have up to ${maxImages} images.`);
      return;
    }
    
    try {
      setUploadingImage(true);
      
      // Upload image to Supabase storage
      const imageUrl = await uploadProfileImage(file, images.length);
      
      // Add the new image to the profile
      const newImages = [...images, imageUrl];
      onImagesChange(newImages);
      
      toast.success('Image uploaded successfully');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVerificationRequest = () => {
    setVerificationOpen(true);
  };
  
  const handleVerificationSuccess = async () => {
    onVerificationRequest();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-love">Profile Images</h2>
        <div className="text-xs text-muted-foreground">
          {images.length}/{maxImages} images
        </div>
      </div>
      
      <ProfileImageGrid 
        images={images}
        visibleImages={Array.from({ length: images.length }, (_, i) => i)}
        maxImages={maxImages}
        onImageUploaded={(file) => handleImageUploaded(file)}
        onRemoveImage={handleRemoveImage}
        onToggleVisibility={() => {}}
        onMoveImageUp={() => {}}
        onMoveImageDown={() => {}}
      />
      
      <div className="space-y-4">
        <ImageUrlInput 
          maxImages={maxImages}
          currentImagesCount={images.length}
          onAddImage={handleAddImage}
          isSubmitting={uploadingImage}
        />
        
        <div className="text-xs text-muted-foreground">
          You must have at least {minImages} images and can add up to {maxImages} images.
        </div>
      </div>
      
      <div className="pt-4 border-t border-island-light">
        <VerificationSection
          verified={verified}
          onVerificationRequest={handleVerificationRequest}
        />
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

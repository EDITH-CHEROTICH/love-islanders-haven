
import { useState } from 'react';
import { Image } from 'lucide-react';
import { useAuth } from '@/context/auth';
import VerificationPopup from '../verification/VerificationPopup';
import ProfileImageGrid from './image-controls/ProfileImageGrid';
import ImageUrlInput from './image-controls/ImageUrlInput';
import VerificationSection from './profile/verification/VerificationSection';
import { useProfileImages } from '@/hooks/profile/useProfileImages';

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
  
  const {
    images: managedImages,
    visibleImages,
    isSubmitting,
    minImages,
    maxImages,
    handleRemoveImage,
    handleAddImage,
    handleImageUploaded,
    toggleImageVisibility,
    moveImageUp,
    moveImageDown
  } = useProfileImages(images, onImagesChange);

  const handleVerificationRequest = () => {
    setVerificationOpen(true);
  };
  
  const handleVerificationSuccess = async () => {
    // Call the onVerificationRequest callback to update parent components
    onVerificationRequest();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-love">Profile Images</h2>
        <div className="text-xs text-muted-foreground">
          {managedImages.length}/{maxImages} images
        </div>
      </div>
      
      <ProfileImageGrid 
        images={managedImages}
        visibleImages={visibleImages}
        maxImages={maxImages}
        onImageUploaded={handleImageUploaded}
        onRemoveImage={handleRemoveImage}
        onToggleVisibility={toggleImageVisibility}
        onMoveImageUp={moveImageUp}
        onMoveImageDown={moveImageDown}
      />
      
      <div className="space-y-4">
        <ImageUrlInput 
          maxImages={maxImages}
          currentImagesCount={managedImages.length}
          onAddImage={handleAddImage}
          isSubmitting={isSubmitting}
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

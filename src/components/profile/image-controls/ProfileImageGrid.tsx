
import ProfileImageItem from './ProfileImageItem';
import ProfileImageUploader from '../ProfileImageUploader';

interface ProfileImageGridProps {
  images: string[];
  visibleImages: number[];
  maxImages: number;
  onImageUploaded: (imageUrl: string) => void;
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
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((image, i) => (
        <ProfileImageItem
          key={i}
          image={image}
          index={i}
          totalImages={images.length}
          isVisible={visibleImages.includes(i)}
          onRemove={onRemoveImage}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveImageUp}
          onMoveDown={onMoveImageDown}
        />
      ))}
      
      {images.length < maxImages && (
        <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
          <div className="text-center p-4">
            <ProfileImageUploader 
              onImageUploaded={onImageUploaded}
              position={images.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageGrid;

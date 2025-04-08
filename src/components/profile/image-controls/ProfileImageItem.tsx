
import { Trash2, EyeOff, Eye } from 'lucide-react';
import ImageVisibilityToggle from './ImageVisibilityToggle';
import ImageOrderControls from './ImageOrderControls';
import { useState } from 'react';

interface ProfileImageItemProps {
  image: string;
  index: number;
  totalImages: number;
  isVisible: boolean;
  onRemove: (index: number) => void;
  onToggleVisibility: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const ProfileImageItem = ({
  image,
  index,
  totalImages,
  isVisible,
  onRemove,
  onToggleVisibility,
  onMoveUp,
  onMoveDown
}: ProfileImageItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await onRemove(index);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden group">
      <img 
        src={image} 
        alt={`Profile image ${index+1}`}
        className={`w-full h-full object-cover ${!isVisible ? 'opacity-50' : ''}`}
      />
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <button 
          className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          onClick={handleRemove}
          disabled={isDeleting}
          aria-label="Remove image"
        >
          {isDeleting ? (
            <span className="animate-spin h-4 w-4 border-2 border-white/80 border-t-transparent rounded-full" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
        <ImageVisibilityToggle 
          index={index}
          isVisible={isVisible}
          onToggle={onToggleVisibility}
        />
      </div>
      <div className="absolute bottom-2 right-2">
        <ImageOrderControls 
          index={index}
          totalImages={totalImages}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      </div>
      {index === 0 && (
        <div className="absolute top-2 left-2 bg-love/80 text-white text-xs px-2 py-1 rounded-md">
          Primary
        </div>
      )}
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <EyeOff size={24} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ProfileImageItem;

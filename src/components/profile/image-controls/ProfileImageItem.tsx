
import { Trash2, EyeOff } from 'lucide-react';
import ImageVisibilityToggle from './ImageVisibilityToggle';
import ImageOrderControls from './ImageOrderControls';

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
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden group">
      <img 
        src={image} 
        alt={`Profile image ${index+1}`}
        className={`w-full h-full object-cover ${!isVisible ? 'opacity-50' : ''}`}
      />
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <button 
          className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(index)}
          aria-label="Remove image"
        >
          <Trash2 size={16} />
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

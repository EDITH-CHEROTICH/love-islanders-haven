
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ImageOrderControlsProps {
  index: number;
  totalImages: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const ImageOrderControls = ({ 
  index, 
  totalImages, 
  onMoveUp, 
  onMoveDown 
}: ImageOrderControlsProps) => {
  return (
    <div className="flex flex-col gap-1">
      {index > 0 && (
        <button
          className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onMoveUp(index)}
          aria-label="Move image up"
        >
          <ArrowUp size={16} />
        </button>
      )}
      {index < totalImages - 1 && (
        <button
          className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onMoveDown(index)}
          aria-label="Move image down"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
};

export default ImageOrderControls;

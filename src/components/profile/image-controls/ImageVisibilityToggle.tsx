
import { EyeOff, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageVisibilityToggleProps {
  index: number;
  isVisible: boolean;
  onToggle: (index: number) => void;
}

const ImageVisibilityToggle = ({ index, isVisible, onToggle }: ImageVisibilityToggleProps) => {
  const { toast } = useToast();
  
  const handleToggle = () => {
    onToggle(index);
  };
  
  return (
    <button 
      className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleToggle}
      aria-label={isVisible ? "Hide image" : "Show image"}
    >
      {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
    </button>
  );
};

export default ImageVisibilityToggle;

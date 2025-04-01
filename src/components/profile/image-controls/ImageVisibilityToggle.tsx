
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
    
    toast({
      title: isVisible ? "Image hidden" : "Image visible",
      description: isVisible ? "Others won't see this image" : "This image is now visible to others",
    });
  };
  
  return (
    <button 
      className="bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleToggle}
      aria-label={isVisible ? "Hide image" : "Show image"}
      title={isVisible ? "Hide image" : "Show image"}
    >
      {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
};

export default ImageVisibilityToggle;

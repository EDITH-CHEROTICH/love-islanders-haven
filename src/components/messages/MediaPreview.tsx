
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

interface MediaPreviewProps {
  mediaPreview: string | null;
  uploadType: 'image' | 'audio' | null;
  onCancel: () => void;
}

const MediaPreview = ({ mediaPreview, uploadType, onCancel }: MediaPreviewProps) => {
  if (!mediaPreview) return null;

  return (
    <div className="mb-2 bg-island-light/30 p-2 rounded-md relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-0 right-0 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full" 
        onClick={onCancel}
      >
        <X size={14} />
      </Button>
      
      {uploadType === 'image' ? (
        <img src={mediaPreview} alt="Preview" className="h-32 max-w-full rounded-md mx-auto object-contain" />
      ) : (
        <div className="flex items-center space-x-2 text-white py-2">
          <Mic size={18} />
          <span className="text-sm">{mediaPreview}</span>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;

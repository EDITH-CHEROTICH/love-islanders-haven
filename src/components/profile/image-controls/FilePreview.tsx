
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
  fileName: string;
  onRemove: () => void;
  onConfirm: () => void;
  isUploading: boolean;
}

const FilePreview = ({ fileName, onRemove, onConfirm, isUploading }: FilePreviewProps) => {
  return (
    <div className="p-2 bg-island-light/20 rounded-md">
      <div className="flex items-center justify-between">
        <span className="text-sm truncate max-w-[200px]">{fileName}</span>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={onRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="default" 
            className="h-8 w-8 p-0 bg-love hover:bg-love-dark"
            onClick={onConfirm}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white/80 border-t-transparent rounded-full" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;

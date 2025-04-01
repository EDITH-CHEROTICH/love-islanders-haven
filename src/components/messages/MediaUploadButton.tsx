
import { useRef } from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploadButtonProps {
  onFileSelected: (file: File, type: 'image' | 'audio') => void;
  type: 'image' | 'audio';
  disabled: boolean;
}

const MediaUploadButton = ({ onFileSelected, type, disabled }: MediaUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onFileSelected(file, type);
  };
  
  return (
    <>
      <input
        type="file"
        accept={type === 'image' ? 'image/*' : 'audio/*'}
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        className="text-love hover:text-love-light hover:bg-love/10"
        disabled={disabled}
      >
        <Image size={20} />
      </Button>
    </>
  );
};

export default MediaUploadButton;

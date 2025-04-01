
import { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadProfileImage } from '@/services/profiles/uploads';
import { saveProfileImage } from '@/services/profiles/media';

interface ProfileImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  position: number;
}

const ProfileImageUploader = ({ onImageUploaded, position }: ProfileImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive'
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Image must be less than 5MB',
          variant: 'destructive'
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // 1. Upload file to Supabase storage
      const imageUrl = await uploadProfileImage(file);
      
      // 2. Save the URL to the profile images table with position
      await saveProfileImage(imageUrl, position);
      
      // 3. Notify parent component
      onImageUploaded(imageUrl);
      
      toast({
        title: 'Image uploaded successfully',
        description: 'Your profile image has been updated',
      });
      
      // Reset file state
      setFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your image',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          id={`image-upload-${position}`}
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label
          htmlFor={`image-upload-${position}`}
          className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white bg-love rounded-md hover:bg-love-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-love cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Image
        </label>
      </div>
      
      {file && (
        <div className="p-2 bg-island-light/20 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                className="h-8 w-8 p-0 bg-love hover:bg-love-dark"
                onClick={handleUpload}
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
      )}
    </div>
  );
};

export default ProfileImageUploader;

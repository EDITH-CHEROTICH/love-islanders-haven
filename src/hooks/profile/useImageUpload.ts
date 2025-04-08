
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadProfileImage } from '@/services/profiles/uploads';
import { saveProfileImage } from '@/services/profiles/media';

export const useImageUpload = (position: number, onImageUploaded: (imageUrl: string) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const validateFile = (selectedFile: File): boolean => {
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return false;
    }
    
    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // 1. Upload file to Supabase storage
      const imageUrl = await uploadProfileImage(file);
      
      // 2. Save the URL to the profile images table with position
      await saveProfileImage(imageUrl, position, true);
      
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
  
  const clearFile = () => setFile(null);
  
  return {
    file,
    isUploading,
    handleFileChange,
    handleUpload,
    clearFile
  };
};

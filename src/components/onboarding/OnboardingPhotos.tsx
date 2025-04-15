
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Plus, Trash2, RotateCw, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { uploadProfileImage, fetchCurrentUserProfileImages } from '@/services/profiles/media';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingPhotosProps {
  profileId: string;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const OnboardingPhotos = ({ profileId, onNext, onBack, isSubmitting }: OnboardingPhotosProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load existing photos
    const loadPhotos = async () => {
      try {
        const images = await fetchCurrentUserProfileImages();
        setPhotos(images);
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    };
    
    loadPhotos();
  }, []);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev !== null ? Math.min(prev + 10, 90) : 10;
          return newProgress;
        });
      }, 300);
      
      // Upload the image
      const position = photos.length;
      const imageUrl = await uploadProfileImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Add the new photo to the list
      setPhotos(prevPhotos => [...prevPhotos, imageUrl]);
      
      toast({
        title: "Photo uploaded",
        description: "Your photo has been added to your profile",
      });
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      // Clear the input
      e.target.value = '';
    }
  };
  
  const handleDeletePhoto = async (index: number) => {
    try {
      const photoToDelete = photos[index];
      
      // Remove from Supabase
      const { error } = await supabase
        .from('profile_images')
        .delete()
        .eq('url', photoToDelete);
        
      if (error) throw error;
      
      // Remove from state
      setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
      
      toast({
        title: "Photo removed",
        description: "The photo has been removed from your profile",
      });
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete photo",
        variant: "destructive"
      });
    }
  };
  
  const handleContinue = () => {
    if (photos.length < 1) {
      toast({
        title: "Photos required",
        description: "Please add at least one photo to continue",
        variant: "destructive"
      });
      return;
    }
    
    onNext({ images: photos });
  };
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">Add Your Photos</h1>
      <p className="text-gray-300 mb-6">Add photos to showcase yourself. You can rearrange them later.</p>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Display existing photos */}
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square bg-island-light/10 rounded-lg overflow-hidden">
            <img 
              src={photo} 
              alt={`Profile ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleDeletePhoto(index)}
              className="absolute bottom-2 right-2 bg-red-500/80 hover:bg-red-600 p-1 rounded-full"
              aria-label="Delete photo"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
        
        {/* Upload button */}
        {photos.length < 6 && (
          <label className="relative aspect-square bg-island-light/10 rounded-lg border-2 border-dashed border-island-light/30 flex flex-col items-center justify-center cursor-pointer hover:bg-island-light/20 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="relative h-10 w-10">
                  <RotateCw className="h-10 w-10 animate-spin text-love" />
                  {uploadProgress !== null && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {uploadProgress}%
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs mt-2">Uploading...</span>
              </div>
            ) : (
              <>
                <Plus className="h-8 w-8 text-love" />
                <span className="text-sm mt-1">Add Photo</span>
              </>
            )}
          </label>
        )}
        
        {/* Placeholder slots */}
        {photos.length < 5 && Array.from({ length: 5 - photos.length }).map((_, index) => (
          <div 
            key={`placeholder-${index}`}
            className="aspect-square bg-island-light/5 rounded-lg border border-island-light/10 flex items-center justify-center"
          >
            <span className="text-gray-500 text-xs">Photo {photos.length + index + 2}</span>
          </div>
        ))}
      </div>
      
      {photos.length > 0 ? (
        <p className="text-sm text-gray-400 mb-6">
          {photos.length === 1 
            ? "Great start! Profiles with 3+ photos get more matches."
            : photos.length < 4
            ? "Looking good! Adding more photos increases your chances."
            : "Perfect! Your profile looks complete."
          }
        </p>
      ) : (
        <p className="text-sm text-gray-400 mb-6">
          Adding photos is essential. Profiles with photos get 10x more matches!
        </p>
      )}
      
      <div className="flex space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="button" 
          onClick={handleContinue}
          className="flex-1 bg-love hover:bg-love-dark"
          disabled={photos.length === 0 || isUploading || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Continue"}
        </Button>
      </div>
    </div>
  );
};

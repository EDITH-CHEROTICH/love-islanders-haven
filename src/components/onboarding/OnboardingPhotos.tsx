import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, RotateCw, Loader2, Image, Film, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { uploadProfileImage } from '@/services/profiles/media';
import { useToast } from '@/hooks/use-toast';

interface OnboardingPhotosProps {
  profileId: string;
  onNext: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

const MIN_PHOTOS = 4;
const MAX_MEDIA = 10;
const MAX_VIDEOS = 2;

export const OnboardingPhotos = ({ profileId, onNext, onBack, isSubmitting }: OnboardingPhotosProps) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { toast } = useToast();
  
  const photoCount = media.filter(m => m.type === 'image').length;
  const videoCount = media.filter(m => m.type === 'video').length;
  
  useEffect(() => {
    // Load existing photos
    const loadPhotos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: images } = await supabase
          .from('profile_images')
          .select('url')
          .eq('profile_id', user.id)
          .order('position');
          
        if (images) {
          setMedia(images.map(img => ({ url: img.url, type: 'image' as const })));
        }
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    };
    
    loadPhotos();
  }, []);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'video' && !file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }
    
    // Check limits
    if (media.length >= MAX_MEDIA) {
      toast({
        title: "Limit reached",
        description: `You can only have up to ${MAX_MEDIA} photos and videos combined`,
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'video' && videoCount >= MAX_VIDEOS) {
      toast({
        title: "Video limit reached",
        description: `You can only have up to ${MAX_VIDEOS} videos`,
        variant: "destructive"
      });
      return;
    }
    
    // Size validation
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: type === 'video' ? "Video must be less than 50MB" : "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev !== null ? Math.min(prev + 10, 90) : 10;
          return newProgress;
        });
      }, 300);
      
      const position = media.length;
      const imageUrl = await uploadProfileImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setMedia(prev => [...prev, { url: imageUrl, type }]);
      
      toast({
        title: `${type === 'video' ? 'Video' : 'Photo'} uploaded`,
        description: `Your ${type} has been added to your profile`,
      });
    } catch (error: any) {
      console.error("Error uploading:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      e.target.value = '';
    }
  };
  
  const handleDeleteMedia = async (index: number) => {
    try {
      const itemToDelete = media[index];
      
      if (itemToDelete.type === 'image') {
        const { error } = await supabase
          .from('profile_images')
          .delete()
          .eq('url', itemToDelete.url);
        if (error) throw error;
      }
      
      setMedia(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: "Removed",
        description: "The file has been removed from your profile",
      });
    } catch (error: any) {
      console.error("Error deleting:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive"
      });
    }
  };
  
  const handleContinue = () => {
    if (photoCount < MIN_PHOTOS) {
      toast({
        title: "More photos needed",
        description: `Please add at least ${MIN_PHOTOS} photos to continue`,
        variant: "destructive"
      });
      return;
    }
    
    const images = media.filter(m => m.type === 'image').map(m => m.url);
    const videos = media.filter(m => m.type === 'video').map(m => m.url);
    
    onNext({ images, videos });
  };
  
  const remainingSlots = MAX_MEDIA - media.length;
  const emptySlots = Math.max(0, MIN_PHOTOS - media.length);
  
  return (
    <div className="bg-island-dark/80 backdrop-blur-sm rounded-lg p-6 text-white animate-fade-in shadow-lg border border-island-light/30">
      <h1 className="text-2xl font-bold mb-2 text-gradient">Add Your Photos</h1>
      <p className="text-gray-300 mb-4">Add at least {MIN_PHOTOS} photos. You can also add up to {MAX_VIDEOS} videos.</p>
      
      {/* Requirements indicator */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-island-light/10">
        <AlertCircle className="h-4 w-4 text-love shrink-0" />
        <p className="text-sm">
          {photoCount < MIN_PHOTOS ? (
            <span className="text-love">Add {MIN_PHOTOS - photoCount} more photo{MIN_PHOTOS - photoCount > 1 ? 's' : ''} to continue</span>
          ) : (
            <span className="text-green-400">✓ Minimum photos added! You can add {remainingSlots} more.</span>
          )}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Display existing media */}
        {media.map((item, index) => (
          <div key={index} className="relative aspect-square bg-island-light/10 rounded-lg overflow-hidden group">
            {item.type === 'video' ? (
              <div className="relative w-full h-full">
                <video 
                  src={item.url}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/60 rounded-full p-1">
                  <Film className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <img 
                src={item.url} 
                alt={`Profile ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => handleDeleteMedia(index)}
              className="absolute bottom-2 right-2 bg-red-500/80 hover:bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-love/90 text-xs px-2 py-0.5 rounded">
                Main
              </div>
            )}
          </div>
        ))}
        
        {/* Photo upload button */}
        {media.length < MAX_MEDIA && (
          <label className="relative aspect-square bg-island-light/10 rounded-lg border-2 border-dashed border-island-light/30 flex flex-col items-center justify-center cursor-pointer hover:bg-island-light/20 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFileChange(e, 'image')}
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
              </div>
            ) : (
              <>
                <Image className="h-6 w-6 text-love mb-1" />
                <Plus className="h-4 w-4 text-love" />
                <span className="text-xs mt-1">Photo</span>
              </>
            )}
          </label>
        )}
        
        {/* Video upload button */}
        {media.length < MAX_MEDIA && videoCount < MAX_VIDEOS && (
          <label className="relative aspect-square bg-island-light/10 rounded-lg border-2 border-dashed border-love/30 flex flex-col items-center justify-center cursor-pointer hover:bg-island-light/20 transition-colors">
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => handleFileChange(e, 'video')}
              disabled={isUploading}
            />
            <Film className="h-6 w-6 text-love mb-1" />
            <Plus className="h-4 w-4 text-love" />
            <span className="text-xs mt-1">Video</span>
          </label>
        )}
        
        {/* Placeholder slots to show required minimum */}
        {Array.from({ length: Math.max(0, emptySlots - 2) }).map((_, index) => (
          <div 
            key={`placeholder-${index}`}
            className="aspect-square bg-island-light/5 rounded-lg border border-island-light/10 flex items-center justify-center"
          >
            <span className="text-gray-500 text-xs">Photo {media.length + index + 3}</span>
          </div>
        ))}
      </div>
      
      {/* Media count summary */}
      <div className="flex justify-between text-sm text-gray-400 mb-6">
        <span>{photoCount} photo{photoCount !== 1 ? 's' : ''}</span>
        <span>{videoCount}/{MAX_VIDEOS} video{videoCount !== 1 ? 's' : ''}</span>
        <span>{media.length}/{MAX_MEDIA} total</span>
      </div>
      
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
          disabled={photoCount < MIN_PHOTOS || isUploading || isSubmitting}
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

export default OnboardingPhotos;

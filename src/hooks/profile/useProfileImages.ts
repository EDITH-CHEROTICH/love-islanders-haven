
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveProfileImage } from '@/services/profiles/media';
import { supabase } from '@/integrations/supabase/client';

interface ImageVisibility {
  imageUrl: string;
  isVisible: boolean;
  position: number;
}

export const useProfileImages = (initialImages: string[], onImagesChange: (images: string[]) => void) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [visibleImages, setVisibleImages] = useState<number[]>(
    Array.from({ length: initialImages.length }, (_, i) => i)
  );
  const [imageVisibilities, setImageVisibilities] = useState<ImageVisibility[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const minImages = 2;
  const maxImages = 6;

  // Initialize image visibilities from the database when component mounts
  useEffect(() => {
    const fetchImageVisibilities = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profile_images')
          .select('url, position, is_visible')
          .eq('profile_id', user.id)
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length) {
          // Initialize visibleImages array based on database values
          const visibleIndices = data
            .filter(item => item.is_visible !== false)
            .map(item => data.findIndex(d => d.url === item.url));
            
          setVisibleImages(visibleIndices);
          
          // Initialize imageVisibilities state
          setImageVisibilities(data.map(item => ({
            imageUrl: item.url,
            isVisible: item.is_visible !== false,
            position: item.position
          })));
        }
      } catch (error) {
        console.error('Error fetching image visibilities:', error);
      }
    };
    
    fetchImageVisibilities();
  }, []);

  const handleRemoveImage = (index: number) => {
    if (images.length <= minImages) {
      toast({
        title: "Error",
        description: `You must have at least ${minImages} images.`,
        variant: "destructive",
      });
      return;
    }

    const newImages = [...images];
    newImages.splice(index, 1);
    
    // Update visible images indices
    setVisibleImages(prev => {
      const updated = prev.filter(i => i !== index).map(i => i > index ? i - 1 : i);
      return updated;
    });
    
    setImages(newImages);
    onImagesChange(newImages);
    
    toast({
      title: "Success",
      description: "Image removed successfully.",
    });
  };

  const handleAddImage = async (imageUrl: string) => {
    setIsSubmitting(true);

    try {
      // Save to Supabase - position is the current length of the images array
      await saveProfileImage(imageUrl, images.length, true); // Set is_visible to true by default
      
      // Update local state
      const newImages = [...images, imageUrl];
      setImages(newImages);
      setVisibleImages(prev => [...prev, images.length]);
      onImagesChange(newImages);
      
      // Update imageVisibilities
      setImageVisibilities(prev => [...prev, {
        imageUrl,
        isVisible: true,
        position: images.length
      }]);
      
      toast({
        title: "Success",
        description: "Image added successfully.",
      });
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    const newImages = [...images, imageUrl];
    setImages(newImages);
    setVisibleImages(prev => [...prev, images.length]);
    onImagesChange(newImages);
    
    // Update imageVisibilities
    setImageVisibilities(prev => [...prev, {
      imageUrl,
      isVisible: true,
      position: images.length
    }]);
  };

  const toggleImageVisibility = async (index: number) => {
    // Don't allow hiding all images
    if (visibleImages.includes(index) && visibleImages.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one visible image",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const imageUrl = images[index];
      const newIsVisible = !visibleImages.includes(index);
      
      // Update in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profile_images')
        .update({ is_visible: newIsVisible })
        .eq('profile_id', user.id)
        .eq('url', imageUrl);
        
      if (error) throw error;
      
      // Update local state
      setVisibleImages(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        } else {
          return [...prev, index];
        }
      });
      
      // Update imageVisibilities
      setImageVisibilities(prev => {
        const newState = [...prev];
        const itemIndex = newState.findIndex(item => item.imageUrl === imageUrl);
        
        if (itemIndex >= 0) {
          newState[itemIndex] = { ...newState[itemIndex], isVisible: newIsVisible };
        }
        
        return newState;
      });
    } catch (error) {
      console.error('Error toggling image visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update image visibility",
        variant: "destructive",
      });
    }
  };

  const moveImageUp = async (index: number) => {
    if (index === 0) return;
    
    try {
      setIsSubmitting(true);
      
      // Swap images in the array
      const newImages = [...images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      
      // Update the positions in the database
      await saveProfileImage(newImages[index - 1], index - 1);
      await saveProfileImage(newImages[index], index);
      
      // Update local state
      setImages(newImages);
      onImagesChange(newImages);
      
      // Update visibleImages indices if needed
      setVisibleImages(prev => {
        const newIndices = [...prev];
        
        if (newIndices.includes(index) && !newIndices.includes(index - 1)) {
          // Replace index with index-1
          const idxPos = newIndices.indexOf(index);
          newIndices[idxPos] = index - 1;
        } else if (!newIndices.includes(index) && newIndices.includes(index - 1)) {
          // Replace index-1 with index
          const idxPos = newIndices.indexOf(index - 1);
          newIndices[idxPos] = index;
        }
        
        return newIndices;
      });
      
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveImageDown = async (index: number) => {
    if (index === images.length - 1) return;
    
    try {
      setIsSubmitting(true);
      
      // Swap images in the array
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      
      // Update the positions in the database
      await saveProfileImage(newImages[index], index);
      await saveProfileImage(newImages[index + 1], index + 1);
      
      // Update local state
      setImages(newImages);
      onImagesChange(newImages);
      
      // Update visibleImages indices if needed
      setVisibleImages(prev => {
        const newIndices = [...prev];
        
        if (newIndices.includes(index) && !newIndices.includes(index + 1)) {
          // Replace index with index+1
          const idxPos = newIndices.indexOf(index);
          newIndices[idxPos] = index + 1;
        } else if (!newIndices.includes(index) && newIndices.includes(index + 1)) {
          // Replace index+1 with index
          const idxPos = newIndices.indexOf(index + 1);
          newIndices[idxPos] = index;
        }
        
        return newIndices;
      });
      
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    images,
    visibleImages,
    isSubmitting,
    minImages,
    maxImages,
    handleRemoveImage,
    handleAddImage,
    handleImageUploaded,
    toggleImageVisibility,
    moveImageUp,
    moveImageDown
  };
};

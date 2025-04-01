
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveProfileImage } from '@/services/profiles/media';

export const useProfileImages = (initialImages: string[], onImagesChange: (images: string[]) => void) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [visibleImages, setVisibleImages] = useState<number[]>(
    Array.from({ length: initialImages.length }, (_, i) => i)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const minImages = 2;
  const maxImages = 6;

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
      await saveProfileImage(imageUrl, images.length);
      
      // Update local state
      const newImages = [...images, imageUrl];
      setImages(newImages);
      setVisibleImages(prev => [...prev, images.length]);
      onImagesChange(newImages);
      
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
  };

  const toggleImageVisibility = (index: number) => {
    setVisibleImages(prev => {
      if (prev.includes(index)) {
        // Don't allow hiding all images
        if (prev.length <= 1) {
          toast({
            title: "Error",
            description: "You must have at least one visible image",
            variant: "destructive",
          });
          return prev;
        }
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
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

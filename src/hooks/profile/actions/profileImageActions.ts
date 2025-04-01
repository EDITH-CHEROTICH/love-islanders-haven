
import { useToast } from '@/hooks/use-toast';
import { saveProfileImage } from '@/services/profiles/media';
import { updateImageVisibilityInDB, updateImagePositionInDB } from '../services/profileImageServices';

export const useProfileImageActions = (
  images: string[],
  visibleImages: number[],
  setImages: React.Dispatch<React.SetStateAction<string[]>>,
  setVisibleImages: React.Dispatch<React.SetStateAction<number[]>>,
  setImageVisibilities: React.Dispatch<React.SetStateAction<any[]>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  onImagesChange: (images: string[]) => void,
  minImages: number,
  maxImages: number
) => {
  const { toast } = useToast();

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
      const success = await updateImageVisibilityInDB(imageUrl, newIsVisible);
      if (!success) throw new Error('Failed to update visibility in database');
      
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

      toast({
        title: newIsVisible ? "Image now visible" : "Image hidden",
        description: newIsVisible ? "Others can now see this image" : "Others won't see this image",
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
      await updateImagePositionInDB(newImages[index - 1], index - 1);
      await updateImagePositionInDB(newImages[index], index);
      
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
      await updateImagePositionInDB(newImages[index], index);
      await updateImagePositionInDB(newImages[index + 1], index + 1);
      
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
    handleRemoveImage,
    handleAddImage,
    handleImageUploaded,
    toggleImageVisibility,
    moveImageUp,
    moveImageDown
  };
};

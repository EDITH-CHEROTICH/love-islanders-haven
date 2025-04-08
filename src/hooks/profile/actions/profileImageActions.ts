
import { Dispatch, SetStateAction } from 'react';
import { saveProfileImage, deleteProfileImage, updateProfileImagePosition, updateProfileImageVisibility } from '@/services/profiles/media';
import { ImageVisibility, ProfileImageAction } from '../types/profileImageTypes';
import { toast } from 'sonner';

export const useProfileImageActions = (
  images: string[],
  visibleImages: number[],
  setImages: Dispatch<SetStateAction<string[]>>,
  setVisibleImages: Dispatch<SetStateAction<number[]>>,
  setImageVisibilities: Dispatch<SetStateAction<ImageVisibility[]>>,
  setIsSubmitting: Dispatch<SetStateAction<boolean>>,
  onImagesChange: (images: string[]) => void,
  minImages: number,
  maxImages: number
): ProfileImageAction => {
  const handleRemoveImage = async (index: number) => {
    if (images.length <= minImages) {
      toast.error(`You must have at least ${minImages} images.`);
      return;
    }

    try {
      // Delete from database
      await deleteProfileImage(images[index]);
      
      // Update local state
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      
      // Update visible images indices
      const newVisibleImages = visibleImages.filter(i => i !== index).map(i => i > index ? i - 1 : i);
      setVisibleImages(newVisibleImages);
      
      // Update parent component
      onImagesChange(newImages);
      
      toast.success("Image removed successfully.");
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  const handleAddImage = async (url: string) => {
    if (images.length >= maxImages) {
      toast.error(`You can only have up to ${maxImages} images.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Save to database
      await saveProfileImage(url, images.length);
      
      // Update local state
      const newImages = [...images, url];
      setImages(newImages);
      
      // Add to visible images by default
      setVisibleImages([...visibleImages, images.length]);
      
      // Update parent component
      onImagesChange(newImages);
      
      toast.success("Image added successfully.");
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error("Failed to add image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    handleAddImage(imageUrl);
  };

  const toggleImageVisibility = async (index: number) => {
    const isCurrentlyVisible = visibleImages.includes(index);
    
    try {
      // Ensure we don't hide all images
      if (isCurrentlyVisible && visibleImages.length <= 1) {
        toast.error("You must have at least one visible image.");
        return;
      }
      
      // Update in database
      await updateProfileImageVisibility(images[index], !isCurrentlyVisible);
      
      // Update local state
      if (isCurrentlyVisible) {
        setVisibleImages(visibleImages.filter(i => i !== index));
      } else {
        setVisibleImages([...visibleImages, index]);
      }
      
      toast.success(isCurrentlyVisible ? "Image hidden." : "Image now visible.");
    } catch (error) {
      console.error('Error toggling image visibility:', error);
      toast.error("Failed to update image visibility. Please try again.");
    }
  };

  const moveImageUp = async (index: number) => {
    if (index <= 0) return;
    
    try {
      // Update positions in database
      await updateProfileImagePosition(images[index], index - 1);
      await updateProfileImagePosition(images[index - 1], index);
      
      // Update local state
      const newImages = [...images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      setImages(newImages);
      
      // Update visible images indices if needed
      const newVisibleImages = visibleImages.map(i => {
        if (i === index) return i - 1;
        if (i === index - 1) return i + 1;
        return i;
      });
      setVisibleImages(newVisibleImages);
      
      // Update parent component
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error moving image up:', error);
      toast.error("Failed to reorder images. Please try again.");
    }
  };

  const moveImageDown = async (index: number) => {
    if (index >= images.length - 1) return;
    
    try {
      // Update positions in database
      await updateProfileImagePosition(images[index], index + 1);
      await updateProfileImagePosition(images[index + 1], index);
      
      // Update local state
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setImages(newImages);
      
      // Update visible images indices if needed
      const newVisibleImages = visibleImages.map(i => {
        if (i === index) return i + 1;
        if (i === index + 1) return i - 1;
        return i;
      });
      setVisibleImages(newVisibleImages);
      
      // Update parent component
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error moving image down:', error);
      toast.error("Failed to reorder images. Please try again.");
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

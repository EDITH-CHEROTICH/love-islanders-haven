
import { useState, useEffect } from 'react';
import { ImageVisibility, UseProfileImagesState } from '../types/profileImageTypes';
import { fetchImageVisibilitiesFromDB } from '../services/profileImageServices';

export const useProfileImagesState = (initialImages: string[]): UseProfileImagesState => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [visibleImages, setVisibleImages] = useState<number[]>(
    Array.from({ length: initialImages.length }, (_, i) => i)
  );
  const [imageVisibilities, setImageVisibilities] = useState<ImageVisibility[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize image visibilities from the database when component mounts
  useEffect(() => {
    const initializeVisibilities = async () => {
      const dbVisibilities = await fetchImageVisibilitiesFromDB();
      
      if (dbVisibilities.length) {
        // Find visible indices based on database values
        const visibleIndices = dbVisibilities
          .filter(item => item.isVisible)
          .map(item => {
            // Find the index in the images array that corresponds to this URL
            return images.findIndex(imgUrl => imgUrl === item.imageUrl);
          })
          .filter(index => index !== -1); // Filter out any not found
          
        setVisibleImages(visibleIndices);
        setImageVisibilities(dbVisibilities);
      }
    };
    
    initializeVisibilities();
  }, [images]);

  return {
    images,
    setImages,
    visibleImages,
    setVisibleImages,
    imageVisibilities,
    setImageVisibilities,
    isSubmitting,
    setIsSubmitting
  };
};

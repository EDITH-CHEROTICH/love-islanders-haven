
import { useProfileImagesState } from './state/useProfileImagesState';
import { useProfileImageActions } from './actions/profileImageActions';
import { UseProfileImagesReturn } from './types/profileImageTypes';

export const useProfileImages = (
  initialImages: string[], 
  onImagesChange: (images: string[]) => void
): UseProfileImagesReturn => {
  const minImages = 2;
  const maxImages = 6;

  const {
    images,
    setImages,
    visibleImages,
    setVisibleImages,
    imageVisibilities,
    setImageVisibilities,
    isSubmitting,
    setIsSubmitting
  } = useProfileImagesState(initialImages);

  const actions = useProfileImageActions(
    images,
    visibleImages,
    setImages,
    setVisibleImages,
    setImageVisibilities,
    setIsSubmitting,
    onImagesChange,
    minImages,
    maxImages
  );

  return {
    images,
    visibleImages,
    imageVisibilities,
    isSubmitting,
    minImages,
    maxImages,
    ...actions
  };
};

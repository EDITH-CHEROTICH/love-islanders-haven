
export interface ImageVisibility {
  imageUrl: string;
  isVisible: boolean;
  position: number;
}

export interface UseProfileImagesState {
  images: string[];
  visibleImages: number[];
  imageVisibilities: ImageVisibility[];
  isSubmitting: boolean;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setVisibleImages: React.Dispatch<React.SetStateAction<number[]>>;
  setImageVisibilities: React.Dispatch<React.SetStateAction<ImageVisibility[]>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UseProfileImagesActions {
  handleRemoveImage: (index: number) => void;
  handleAddImage: (imageUrl: string) => Promise<void>;
  handleImageUploaded: (imageUrl: string) => void;
  toggleImageVisibility: (index: number) => Promise<void>;
  moveImageUp: (index: number) => Promise<void>;
  moveImageDown: (index: number) => Promise<void>;
}

export interface UseProfileImagesReturn extends Omit<UseProfileImagesState, 
  'setImages' | 'setVisibleImages' | 'setImageVisibilities' | 'setIsSubmitting'>, 
  UseProfileImagesActions {
  minImages: number;
  maxImages: number;
}

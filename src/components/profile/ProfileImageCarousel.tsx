
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProfileImageCarouselProps {
  images: string[];
  name: string;
  visibleImagesIndices?: number[];
  isEditable?: boolean;
}

const ProfileImageCarousel = ({ 
  images, 
  name, 
  visibleImagesIndices,
  isEditable = false
}: ProfileImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter images based on visibility if not in edit mode
  const displayImages = isEditable 
    ? images 
    : (visibleImagesIndices 
        ? images.filter((_, index) => visibleImagesIndices.includes(index))
        : images);
  
  if (displayImages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-island-dark/50 text-muted-foreground">
        No images available
      </div>
    );
  }
  
  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <div className="relative w-full h-full">
      <img 
        src={displayImages[currentIndex]} 
        alt={`${name}'s profile`}
        className="w-full h-full object-cover"
      />
      
      {displayImages.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {displayImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileImageCarousel;

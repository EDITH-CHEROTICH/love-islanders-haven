
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';

interface ProfileImageCarouselProps {
  images: string[];
  name: string;
  visibleImagesIndices?: number[]; // Optional indices of images that should be visible
}

const ProfileImageCarousel = ({ images, name, visibleImagesIndices }: ProfileImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter images if visibleImagesIndices is provided, otherwise use all images
  const visibleImages = visibleImagesIndices 
    ? images.filter((_, index) => visibleImagesIndices.includes(index))
    : images;

  // If no images are visible after filtering, use the first image
  const displayImages = visibleImages.length > 0 ? visibleImages : [images[0]];

  // If there's only one image, show it directly
  if (displayImages.length === 1) {
    return (
      <img 
        src={displayImages[0]} 
        alt={name} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }

  // For multiple images, use the carousel
  return (
    <Carousel className="w-full h-full">
      <CarouselContent className="h-full">
        {displayImages.map((image, idx) => (
          <CarouselItem key={idx} className="h-full">
            <div className="h-full w-full">
              <img 
                src={image} 
                alt={`${name} photo ${idx+1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 h-8 w-8 bg-black/20 text-white absolute" />
      <CarouselNext className="right-2 h-8 w-8 bg-black/20 text-white absolute" />
    </Carousel>
  );
};

export default ProfileImageCarousel;


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
}

const ProfileImageCarousel = ({ images, name }: ProfileImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // If there's only one image, show it directly
  if (images.length === 1) {
    return (
      <img 
        src={images[0]} 
        alt={name} 
        className="w-full h-[50vh] object-cover"
        loading="lazy"
      />
    );
  }

  // For multiple images, use the carousel
  return (
    <Carousel className="w-full h-[50vh]">
      <CarouselContent className="h-full">
        {images.map((image, idx) => (
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


import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface MultiImagePreviewProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  isUploading: boolean;
}

const MultiImagePreview = ({ images, onRemoveImage, isUploading }: MultiImagePreviewProps) => {
  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((imageUrl, index) => (
            <CarouselItem key={index} className="relative">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <Button 
                type="button"
                onClick={() => onRemoveImage(index)}
                disabled={isUploading}
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {index + 1}/{images.length}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default MultiImagePreview;

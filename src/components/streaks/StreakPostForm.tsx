
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload, Loader2, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import MultiImagePreview from "./MultiImagePreview";

const StreakPostForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [content, setContent] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [duration, setDuration] = useState(24); 
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Handle image selection
  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding new files would exceed the limit
    if (previewUrls.length + files.length > 10) {
      toast({
        title: "Too many images",
        description: "You can only upload up to 10 images for a streak post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    const newImages = [];
    let processed = 0;
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        processed++;
        checkAllProcessed();
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          newImages.push(reader.result.toString());
        }
        processed++;
        checkAllProcessed();
      };
      
      reader.onerror = () => {
        processed++;
        checkAllProcessed();
      };
      
      reader.readAsDataURL(file);
    });
    
    function checkAllProcessed() {
      if (processed === files.length) {
        if (newImages.length > 0) {
          const updatedPreviews = [...previewUrls, ...newImages];
          setPreviewUrls(updatedPreviews);
          setContent(updatedPreviews);
        }
        setIsUploading(false);
      }
    }
  };
  
  // Remove image
  const removeImage = (index) => {
    setPreviewUrls(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setContent(updated); // Keep in sync
      return updated;
    });
  };
  
  // Clear all images
  const clearImages = () => {
    setPreviewUrls([]);
    setContent([]);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (content.length === 0) {
      toast({
        title: "Missing content",
        description: "Please select at least one image for your streak post.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const contentCopy = [...content];
      await onSubmit({ content: contentCopy, duration });
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload Section */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-md overflow-hidden relative">
        {previewUrls.length > 0 ? (
          <div className="relative">
            <MultiImagePreview 
              images={previewUrls} 
              onRemoveImage={removeImage} 
              isUploading={isUploading}
            />
            
            {previewUrls.length < 10 && (
              <div className="p-2 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {previewUrls.length} of 10 images
                </p>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden"
                  disabled={isUploading || isSubmitting}
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add More</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading || isSubmitting}
                    multiple
                  />
                </Button>
              </div>
            )}
            
            {previewUrls.length > 1 && (
              <Button 
                type="button"
                onClick={clearImages}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                size="icon"
                variant="ghost"
                disabled={isUploading || isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-2">
              Select photos for your streak (up to 10)
            </p>
            <Button 
              type="button"
              variant="outline"
              className="relative overflow-hidden flex items-center gap-2"
              disabled={isUploading || isSubmitting}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Choose Images</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading || isSubmitting}
                multiple
              />
            </Button>
          </div>
        )}
      </div>
      
      {/* Duration Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Streak Duration: {duration} {duration === 1 ? 'hour' : 'hours'}
        </label>
        <Slider 
          defaultValue={[24]} 
          value={[duration]}
          max={24} 
          min={1} 
          step={1} 
          onValueChange={(value) => setDuration(value[0])}
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Your streak will expire after {duration} {duration === 1 ? 'hour' : 'hours'} if not renewed.
        </p>
      </div>
      
      {/* Form Controls */}
      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={content.length === 0 || isUploading || isSubmitting}
          className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            "Post Streak"
          )}
        </Button>
      </div>
    </form>
  );
};

export default StreakPostForm;

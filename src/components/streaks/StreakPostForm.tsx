
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface StreakPostFormProps {
  onSubmit: (data: { content: string; caption?: string }) => void;
  onCancel: () => void;
}

const StreakPostForm = ({ onSubmit, onCancel }: StreakPostFormProps) => {
  const [content, setContent] = useState<string>("/placeholder.svg"); // For demo purposes, using placeholder
  const [caption, setCaption] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // In a real implementation, you would upload the file to storage here
      // For now, we'll just create a local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setContent("/placeholder.svg"); // In real implementation, this would be the URL from storage
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content, caption });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-md overflow-hidden relative">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full aspect-square object-cover"
            />
            <button 
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-2">
              Snap a photo for your streak
            </p>
            <Button 
              type="button"
              variant="outline"
              className="relative overflow-hidden"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Select Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="caption" className="block text-sm font-medium mb-1">
          Caption (optional)
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
          placeholder="Add a caption to your streak post..."
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!previewUrl && !content}
        >
          Post Streak
        </Button>
      </div>
    </form>
  );
};

export default StreakPostForm;

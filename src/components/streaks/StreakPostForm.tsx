
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Music } from "lucide-react";
import { SongData } from "./types";
import { Input } from "@/components/ui/input";

interface StreakPostFormProps {
  onSubmit: (data: { content: string; caption?: string; song?: SongData }) => void;
  onCancel: () => void;
}

const StreakPostForm = ({ onSubmit, onCancel }: StreakPostFormProps) => {
  const [content, setContent] = useState<string>("/placeholder.svg"); // For demo purposes, using placeholder
  const [caption, setCaption] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSongInput, setShowSongInput] = useState(false);
  const [song, setSong] = useState<SongData | null>(null);

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
    onSubmit({ 
      content, 
      caption,
      song: song || undefined
    });
  };

  const handleSongAdd = () => {
    if (!showSongInput) {
      setShowSongInput(true);
      return;
    }
    
    // In a real implementation, this would connect to a music API
    // For demo purposes, we'll just use the entered values
    if (songTitle && songArtist) {
      setSong({
        title: songTitle,
        artist: songArtist,
        album_art: "/placeholder.svg", // Placeholder for demo
      });
      setShowSongInput(false);
    }
  };

  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");

  const removeSong = () => {
    setSong(null);
    setSongTitle("");
    setSongArtist("");
    setShowSongInput(false);
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
      
      {!song && !showSongInput && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleSongAdd}
          className="flex items-center gap-2 w-full"
        >
          <Music size={16} />
          <span>Add a song</span>
        </Button>
      )}

      {showSongInput && (
        <div className="space-y-3 p-3 border rounded-md">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Music size={16} />
            <span>Add a song</span>
          </h3>
          <div className="space-y-2">
            <Input
              placeholder="Song title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
            />
            <Input
              placeholder="Artist"
              value={songArtist}
              onChange={(e) => setSongArtist(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowSongInput(false)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSongAdd} disabled={!songTitle || !songArtist}>
              Add Song
            </Button>
          </div>
        </div>
      )}

      {song && (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
              <Music size={16} />
            </div>
            <div>
              <p className="font-medium text-sm">{song.title}</p>
              <p className="text-xs text-muted-foreground">{song.artist}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={removeSong}>
            <X size={16} />
          </Button>
        </div>
      )}
      
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

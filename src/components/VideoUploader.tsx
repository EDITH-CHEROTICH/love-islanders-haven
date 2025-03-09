
import { useState } from 'react';
import { FilmIcon, Trash2, PlusCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoUploaderProps {
  videos: string[];
  onVideosChange: (videos: string[]) => void;
}

const VideoUploader = ({ videos, onVideosChange }: VideoUploaderProps) => {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState('');
  const maxVideos = 2;
  const maxDuration = 10; // seconds

  const handleAddVideo = () => {
    if (!videoUrl) {
      toast({
        title: "Error",
        description: "Please enter a video URL.",
        variant: "destructive",
      });
      return;
    }

    if (videos.length >= maxVideos) {
      toast({
        title: "Error",
        description: `You can only have up to ${maxVideos} videos.`,
        variant: "destructive",
      });
      return;
    }

    // This is a simplified check - in a real app, you'd validate the video duration
    if (!videoUrl.match(/^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i)) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL (MP4, WebM, OGG).",
        variant: "destructive",
      });
      return;
    }

    // In a real-world scenario, we would check video duration here
    // For this demo, we'll just simulate it with a toast message
    toast({
      title: "Video Check",
      description: "Verifying video is under 10 seconds...",
    });

    // Simulate checking video duration
    setTimeout(() => {
      onVideosChange([...videos, videoUrl]);
      setVideoUrl('');
      
      toast({
        title: "Success",
        description: "Video added successfully.",
      });
    }, 1000);
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    onVideosChange(newVideos);
    
    toast({
      title: "Success",
      description: "Video removed successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-love">Your Videos</h3>
        <div className="text-xs text-muted-foreground">
          {videos.length}/{maxVideos} videos
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {videos.map((video, i) => (
          <div key={i} className="relative aspect-video bg-island-dark rounded-lg overflow-hidden group">
            <video 
              src={video} 
              controls
              className="w-full h-full object-cover" 
            />
            <button 
              className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveVideo(i)}
              aria-label="Remove video"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {videos.length < maxVideos && Array.from({ length: maxVideos - videos.length }).map((_, i) => (
          <div key={i} className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
            <div className="text-center">
              <FilmIcon className="mx-auto h-10 w-10 text-muted-foreground" />
              <span className="mt-2 block text-xs text-muted-foreground">Add Video</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-love-light" />
          <p className="text-xs text-muted-foreground">
            Videos must be max {maxDuration} seconds long. Add up to {maxVideos} videos to showcase your personality.
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL (MP4, WebM, OGG)"
            className="flex-1 bg-island-dark border-island-light border px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-love"
            disabled={videos.length >= maxVideos}
          />
          <button
            onClick={handleAddVideo}
            disabled={videos.length >= maxVideos || !videoUrl}
            className="bg-love hover:bg-love-light text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PlusCircle size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;

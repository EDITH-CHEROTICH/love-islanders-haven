
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Flame, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { StreakPost as StreakPostType } from "./types";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface StreakPostProps {
  post: StreakPostType;
  onLike: () => void;
}

const StreakPost = ({ post, onLike }: StreakPostProps) => {
  const { isPlaying, currentAudioId, playAudio } = useAudioPlayer();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike();
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  // Check if content is an array
  const contentArray = Array.isArray(post.content) ? post.content : 
                      (typeof post.content === 'string' ? [post.content] : []);
  
  const hasMultipleImages = contentArray.length > 1;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-3">
          {post.user_profile_image ? (
            <img 
              src={post.user_profile_image} 
              alt={post.user_name} 
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{post.user_name}</p>
              <div className="flex items-center gap-1 text-sm text-love">
                <Flame className="h-3 w-3" />
                <span>{post.streak_count}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Image carousel for multiple images */}
        {contentArray.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {contentArray.map((imageUrl, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square">
                    <img 
                      src={imageUrl} 
                      alt={`Streak post ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    {hasMultipleImages && (
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {index + 1}/{contentArray.length}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hasMultipleImages && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        ) : (
          // Fallback for posts with no valid content
          <div className="w-full aspect-square bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No image available</p>
          </div>
        )}
        
        <div className="p-4">
          {post.caption && <p className="mb-2">{post.caption}</p>}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike} 
            className={`flex items-center gap-1 ${liked ? 'text-love' : ''}`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-love' : ''}`} />
            <span>{post.likes_count + (liked && !post.likes_count.toString().includes('+1') ? ' +1' : '')}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleComment} 
            className="flex items-center gap-1"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments_count}</span>
          </Button>
        </div>
      </CardFooter>
      
      {showComments && (
        <div className="px-4 py-2">
          <Separator className="my-2" />
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..." 
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button size="sm">Post</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StreakPost;

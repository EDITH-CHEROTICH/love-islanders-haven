
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Flame, User, Music, PlayCircle, PauseCircle } from "lucide-react";
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

  const handlePlayPause = () => {
    if (post.song?.previewUrl) {
      playAudio(`post-${post.id}`, post.song.previewUrl);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const hasMultipleImages = Array.isArray(post.content) && post.content.length > 1;

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
        {Array.isArray(post.content) ? (
          <Carousel className="w-full">
            <CarouselContent>
              {post.content.map((imageUrl, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square">
                    <img 
                      src={imageUrl} 
                      alt={`Streak post ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    {hasMultipleImages && (
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {index + 1}/{post.content.length}
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
          // Fallback for older posts with single image
          <img 
            src={post.content as unknown as string} 
            alt="Streak post" 
            className="w-full aspect-square object-cover"
          />
        )}
        
        <div className="p-4">
          {post.caption && <p className="mb-2">{post.caption}</p>}
          
          {post.song && (
            <div className="mt-3 flex items-center justify-between border border-muted rounded-md p-2 bg-black/5">
              <div className="flex items-center gap-2">
                {post.song.albumArt ? (
                  <img 
                    src={post.song.albumArt}
                    alt={`Album art for ${post.song.title}`}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="bg-muted h-10 w-10 rounded-md flex items-center justify-center">
                    <Music className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{post.song.title}</p>
                  <p className="text-xs text-muted-foreground">{post.song.artist}</p>
                  <div className="mt-1 flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                      <path d="M8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0Z" fill="#1DB954"/>
                      <path d="M11.51 11.677C11.384 11.877 11.142 11.935 10.942 11.81C9.08 10.671 6.743 10.412 4.006 11.048C3.782 11.111 3.554 10.981 3.491 10.757C3.428 10.534 3.558 10.306 3.781 10.243C6.783 9.538 9.367 9.84 11.443 11.11C11.643 11.235 11.701 11.477 11.576 11.677H11.51ZM12.499 9.546C12.339 9.796 12.029 9.871 11.779 9.711C9.644 8.382 6.458 7.997 3.9 8.776C3.619 8.856 3.327 8.697 3.247 8.417C3.167 8.136 3.326 7.844 3.607 7.764C6.568 6.873 10.105 7.304 12.559 8.826C12.797 8.974 12.872 9.296 12.724 9.546H12.499ZM12.573 7.366C10.032 5.824 5.846 5.681 3.462 6.462C3.13 6.561 2.781 6.366 2.683 6.033C2.584 5.701 2.78 5.353 3.112 5.254C5.846 4.366 10.428 4.536 13.348 6.309C13.717 6.521 13.827 7.001 13.614 7.358C13.409 7.735 12.93 7.846 12.573 7.634V7.366Z" fill="white"/>
                    </svg>
                    <span className="text-xs text-green-600 font-medium">Spotify</span>
                  </div>
                </div>
              </div>
              {post.song.previewUrl && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handlePlayPause}
                >
                  {currentAudioId === `post-${post.id}` && isPlaying ? (
                    <PauseCircle className="h-6 w-6" />
                  ) : (
                    <PlayCircle className="h-6 w-6" />
                  )}
                </Button>
              )}
            </div>
          )}
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


import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Flame, User, Music, PlayCircle, PauseCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { StreakPost as StreakPostType } from "./types";

interface StreakPostProps {
  post: StreakPostType;
  onLike: () => void;
}

const StreakPost = ({ post, onLike }: StreakPostProps) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike();
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const togglePlayback = () => {
    // In a real implementation, this would control audio playback
    setIsPlaying(!isPlaying);
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

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
        <img 
          src={post.content} 
          alt="Streak post" 
          className="w-full aspect-square object-cover"
        />
        <div className="p-4">
          {post.caption && <p className="mb-2">{post.caption}</p>}
          
          {post.song && (
            <div className="mt-3 flex items-center justify-between border border-muted rounded-md p-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted h-10 w-10 rounded-md flex items-center justify-center">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{post.song.title}</p>
                  <p className="text-xs text-muted-foreground">{post.song.artist}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <PauseCircle className="h-6 w-6" />
                ) : (
                  <PlayCircle className="h-6 w-6" />
                )}
              </Button>
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

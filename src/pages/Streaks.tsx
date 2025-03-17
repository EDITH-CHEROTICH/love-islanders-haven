
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Heart, MessageCircle, Camera, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StreakPost from "@/components/streaks/StreakPost";
import StreakPostForm from "@/components/streaks/StreakPostForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "lucide-react";

export interface StreakPost {
  id: string;
  user_id: string;
  content: string;
  caption?: string;
  created_at: string;
  streak_count: number;
  likes_count: number;
  comments_count: number;
  user_name: string;
  user_profile_image?: string;
}

const Streaks = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<StreakPost[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [hasPostedToday, setHasPostedToday] = useState(false);
  const [userStreakCount, setUserStreakCount] = useState(0);
  const [topStreaks, setTopStreaks] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStreakPosts();
      checkUserStreak();
    }
  }, [isAuthenticated]);

  const fetchStreakPosts = async () => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call to fetch streak posts
      // For now, we'll use dummy data
      const dummyPosts: StreakPost[] = [
        {
          id: "1",
          user_id: "user1",
          content: "/placeholder.svg",
          caption: "Day 5 of my fitness journey! 💪",
          created_at: new Date().toISOString(),
          streak_count: 5,
          likes_count: 12,
          comments_count: 3,
          user_name: "Alex Smith",
        },
        {
          id: "2",
          user_id: "user2",
          content: "/placeholder.svg",
          caption: "Beautiful sunset today!",
          created_at: new Date().toISOString(),
          streak_count: 10,
          likes_count: 25,
          comments_count: 5,
          user_name: "Jamie Taylor",
        },
      ];
      
      setPosts(dummyPosts);
      
      // Also fetch top streaks
      setTopStreaks([
        { name: "Jamie Taylor", count: 30 },
        { name: "Alex Smith", count: 21 },
        { name: "Jordan Lee", count: 15 }
      ]);

    } catch (error) {
      console.error("Error fetching streak posts:", error);
      toast({
        title: "Error",
        description: "Failed to load streak posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserStreak = async () => {
    try {
      // This would check if the user has posted today and get their streak count
      // For now, just set dummy values
      setHasPostedToday(false);
      setUserStreakCount(7);
    } catch (error) {
      console.error("Error checking user streak:", error);
    }
  };

  const handleCreatePost = () => {
    setShowPostForm(true);
  };

  const handlePostSubmit = async (postData: { content: string; caption?: string }) => {
    try {
      // This would submit the post to the backend
      toast({
        title: "Success!",
        description: "Your streak post has been shared!",
      });
      setShowPostForm(false);
      setHasPostedToday(true);
      setUserStreakCount(userStreakCount + 1);
      
      // Add the new post to the list
      const newPost: StreakPost = {
        id: Date.now().toString(),
        user_id: user?.id || "",
        content: postData.content,
        caption: postData.caption,
        created_at: new Date().toISOString(),
        streak_count: userStreakCount + 1,
        likes_count: 0,
        comments_count: 0,
        user_name: "You",
      };
      
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("Error creating streak post:", error);
      toast({
        title: "Error",
        description: "Failed to create streak post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-4">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-center mb-6">Please login to view and post streaks.</p>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Streaks</h1>
        {!showPostForm && !hasPostedToday && (
          <Button onClick={handleCreatePost} className="flex items-center gap-2">
            <Camera size={18} />
            <span>Post</span>
          </Button>
        )}
      </div>

      {showPostForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Streak Post</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakPostForm 
              onSubmit={handlePostSubmit} 
              onCancel={() => setShowPostForm(false)} 
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="text-love h-8 w-8" />
                <div>
                  <p className="text-xl font-bold">{userStreakCount} days</p>
                  <p className="text-sm text-muted-foreground">Current streak</p>
                </div>
              </div>
              <div>
                {hasPostedToday ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <Clock size={18} />
                    <span className="text-sm">Posted today</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-500">
                    <Clock size={18} />
                    <span className="text-sm">Post today to keep your streak!</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStreaks.map((streak, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Award className="text-yellow-500 h-5 w-5" />}
                    <User className="h-8 w-8 p-1 bg-muted rounded-full" />
                    <span>{streak.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="text-love h-4 w-4" />
                    <span className="font-semibold">{streak.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-love"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <StreakPost 
              key={post.id} 
              post={post}
              onLike={() => {
                // Update the post likes count
                setPosts(posts.map(p => {
                  if (p.id === post.id) {
                    return { ...p, likes_count: p.likes_count + 1 };
                  }
                  return p;
                }));
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No streak posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  );
};

export default Streaks;

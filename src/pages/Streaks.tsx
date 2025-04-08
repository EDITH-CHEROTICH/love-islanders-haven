
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import StreakPostForm from "@/components/streaks/StreakPostForm";
import UserStreakCard from "@/components/streaks/UserStreakCard";
import TopStreaksCard from "@/components/streaks/TopStreaksCard";
import StreaksList from "@/components/streaks/StreaksList";
import LoginRequired from "@/components/streaks/LoginRequired";
import Navbar from "@/components/Navbar";
import { AudioPlayerProvider } from "@/hooks/use-audio-player";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { fetchStreakPosts } from "@/hooks/streaks/api/streak-posts";
import { checkUserDailyPost, getTopStreaks } from "@/hooks/streaks/api/streak-interactions";
import useStreaksActions from "@/hooks/streaks/use-streaks-actions";

const Streaks = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [hasPostedToday, setHasPostedToday] = useState(false);
  const [userStreakCount, setUserStreakCount] = useState(0);
  const [topStreaks, setTopStreaks] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  
  // Load data
  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Get streak posts
      const postsData = await fetchStreakPosts();
      setPosts(postsData);
      
      // Check if user has posted today
      if (user?.id) {
        const { hasPostedToday: postedToday, streakCount } = await checkUserDailyPost(user.id);
        setHasPostedToday(postedToday);
        setUserStreakCount(streakCount);
      }
      
      // Get top streaks
      const topStreaksData = await getTopStreaks();
      setTopStreaks(topStreaksData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load streak data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when component mounts or user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  
  // Actions
  const { handlePostSubmit, handleLikePost, isSubmitting } = useStreaksActions(user, fetchData);
  
  const onPostSubmit = async (postData) => {
    const success = await handlePostSubmit(postData);
    if (success) {
      setShowPostForm(false);
      await fetchData(); // Refresh data
    }
    return success;
  };
  
  // If not authenticated, show login required
  if (!isAuthenticated) {
    return <LoginRequired />;
  }
  
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
        <ScrollArea className="h-screen w-full overflow-auto">
          <div className="container max-w-md mx-auto px-4 pt-4 pb-28">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Streaks</h1>
              {!showPostForm && !hasPostedToday && (
                <Button onClick={() => setShowPostForm(true)} className="flex items-center gap-2">
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
                    onSubmit={onPostSubmit} 
                    onCancel={() => setShowPostForm(false)}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-4 mb-6">
              <UserStreakCard 
                streakCount={userStreakCount} 
                hasPostedToday={hasPostedToday} 
              />
              <TopStreaksCard topStreaks={topStreaks} />
            </div>

            <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
            
            <StreaksList 
              loading={loading} 
              posts={posts} 
              onLike={handleLikePost} 
            />
          </div>
        </ScrollArea>
        <Navbar />
      </div>
    </AudioPlayerProvider>
  );
};

export default Streaks;

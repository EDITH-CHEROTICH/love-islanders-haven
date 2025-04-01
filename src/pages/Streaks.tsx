import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import StreakPostForm from "@/components/streaks/StreakPostForm";
import useStreaks from "@/hooks/use-streaks";
import UserStreakCard from "@/components/streaks/UserStreakCard";
import TopStreaksCard from "@/components/streaks/TopStreaksCard";
import StreaksList from "@/components/streaks/StreaksList";
import LoginRequired from "@/components/streaks/LoginRequired";
import Navbar from "@/components/Navbar";
import { AudioPlayerProvider } from "@/hooks/use-audio-player";
import { useToast } from "@/hooks/use-toast";

const Streaks = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { 
    loading, 
    posts, 
    hasPostedToday, 
    userStreakCount, 
    topStreaks,
    handlePostSubmit,
    handleLikePost,
    fetchPosts,
    checkUserStreak
  } = useStreaks();
  const [showPostForm, setShowPostForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Refresh posts when component mounts
    if (isAuthenticated) {
      fetchPosts();
      // Check if user has posted today
      checkUserStreak();
    }
  }, [isAuthenticated]);

  const handleCreatePost = () => {
    setShowPostForm(true);
  };

  const onPostSubmit = async (postData: { 
    content: string[];
    duration?: number 
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Streak form submitted with data:", {
        contentLength: postData.content.length,
        content: postData.content.slice(0, 1), // Log just first item for debugging
        duration: postData.duration
      });
      
      // Validate content data
      if (!postData.content || !Array.isArray(postData.content) || postData.content.length === 0) {
        console.error("Invalid content data:", postData.content);
        toast({
          title: "Error",
          description: "Invalid image data. Please select images again.",
          variant: "destructive",
        });
        return false;
      }
      
      // Submit post
      const success = await handlePostSubmit(postData);
      
      if (success) {
        // Update UI on success
        setShowPostForm(false);
        // Refresh posts and user streak data
        fetchPosts();
        checkUserStreak();
        
        toast({
          title: "Success!",
          description: "Your streak has been posted successfully!",
        });
        
        return true;
      }
      
      console.log("Post submission was not successful");
      return false;
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({
        title: "Error",
        description: "Failed to post your streak. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginRequired />;
  }

  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
        <div className="page-container hide-scrollbar">
          <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
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
        </div>
        <Navbar />
      </div>
    </AudioPlayerProvider>
  );
};

export default Streaks;

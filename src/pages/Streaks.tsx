
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
        duration: postData.duration,
        sampleContent: postData.content.length > 0 ? postData.content[0].substring(0, 50) + "..." : "empty"
      });
      
      // Validate content data before sending
      if (!postData.content || !Array.isArray(postData.content) || postData.content.length === 0) {
        console.error("Invalid content data:", postData.content);
        toast({
          title: "Error",
          description: "Invalid image data. Please select images again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return false;
      }

      // Log what we're submitting
      console.log("Image data being submitted:", postData.content.length, "images");
      
      try {
        // Submit post
        const success = await handlePostSubmit(postData);
        
        if (success) {
          // Update UI on success
          setShowPostForm(false);
          
          // Refresh posts and user streak data
          await fetchPosts();
          await checkUserStreak();
          
          toast({
            title: "Success!",
            description: "Your streak has been posted successfully!",
          });
          
          return true;
        } else {
          console.log("Post submission failed");
          toast({
            title: "Error",
            description: "Something went wrong while posting your streak. Please try again.",
            variant: "destructive",
          });
          return false;
        }
      } catch (error) {
        console.error("Error from handlePostSubmit:", error);
        toast({
          title: "Error",
          description: "Failed to post your streak. Please try again.",
          variant: "destructive",
        });
        return false;
      }
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
        <ScrollArea className="h-screen w-full overflow-auto">
          <div className="container max-w-md mx-auto px-4 pt-4 pb-28">
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
        </ScrollArea>
        <Navbar />
      </div>
    </AudioPlayerProvider>
  );
};

export default Streaks;

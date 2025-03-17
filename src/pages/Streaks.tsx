
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import StreakPostForm from "@/components/streaks/StreakPostForm";
import useStreaks from "@/hooks/use-streaks";
import UserStreakCard from "@/components/streaks/UserStreakCard";
import TopStreaksCard from "@/components/streaks/TopStreaksCard";
import StreaksList from "@/components/streaks/StreaksList";
import LoginRequired from "@/components/streaks/LoginRequired";

const Streaks = () => {
  const { isAuthenticated } = useAuth();
  const { 
    loading, 
    posts, 
    hasPostedToday, 
    userStreakCount, 
    topStreaks,
    handlePostSubmit,
    handleLikePost
  } = useStreaks();
  const [showPostForm, setShowPostForm] = useState(false);

  const handleCreatePost = () => {
    setShowPostForm(true);
  };

  const onPostSubmit = async (postData: { content: string; caption?: string }) => {
    const success = await handlePostSubmit(postData);
    if (success) {
      setShowPostForm(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginRequired />;
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
              onSubmit={onPostSubmit} 
              onCancel={() => setShowPostForm(false)} 
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
  );
};

export default Streaks;

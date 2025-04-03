
import StreakPost from "@/components/streaks/StreakPost";
import { StreakPost as StreakPostType } from "./types";
import LoadingIndicator from "./LoadingIndicator";
import EmptyStreaks from "./EmptyStreaks";
import AdSense from "@/components/ads/AdSense";

interface StreaksListProps {
  loading: boolean;
  posts: StreakPostType[];
  onLike: (postId: string) => void;
}

const StreaksList = ({ loading, posts, onLike }: StreaksListProps) => {
  if (loading) {
    return <LoadingIndicator />;
  }

  if (posts.length === 0) {
    return <EmptyStreaks />;
  }

  // Insert ads after every 2-3 posts (Instagram-like behavior)
  const postsWithAds = [];
  
  posts.forEach((post, index) => {
    // Add the post
    postsWithAds.push(
      <StreakPost 
        key={post.id} 
        post={post}
        onLike={() => onLike(post.id)}
      />
    );
    
    // Insert an ad after every 3rd post
    if ((index + 1) % 3 === 0 && index < posts.length - 1) {
      postsWithAds.push(
        <div key={`ad-${index}`} className="my-4">
          <AdSense 
            adFormat="rectangle"
            className="w-full rounded-lg overflow-hidden"
            style={{ minHeight: '250px' }}
          />
        </div>
      );
    }
  });

  return (
    <div className="space-y-4">
      {/* Ad at the top of the feed */}
      <div className="mb-4">
        <AdSense 
          adFormat="horizontal"
          className="w-full rounded-lg overflow-hidden"
          style={{ minHeight: '100px' }}
        />
      </div>
      
      {/* Posts with interspersed ads */}
      {postsWithAds}
    </div>
  );
};

export default StreaksList;

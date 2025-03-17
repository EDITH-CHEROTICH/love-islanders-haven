
import StreakPost from "@/components/streaks/StreakPost";
import { StreakPost as StreakPostType } from "./types";
import LoadingIndicator from "./LoadingIndicator";
import EmptyStreaks from "./EmptyStreaks";

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

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <StreakPost 
          key={post.id} 
          post={post}
          onLike={() => onLike(post.id)}
        />
      ))}
    </div>
  );
};

export default StreaksList;


// Import individual functions from each file
import { fetchStreakPosts, createStreakPost } from './streak-posts';
import { likeStreakPost } from './likes'; // Only import from likes.ts, not streak-posts.ts
import * as userStreaks from './user-streaks';
import * as topStreaks from './top-streaks';

// Re-export the functions individually to avoid naming conflicts
export { 
  fetchStreakPosts, 
  createStreakPost,
  likeStreakPost,
};

// Re-export everything from the other files
export * from './user-streaks';
export * from './top-streaks';

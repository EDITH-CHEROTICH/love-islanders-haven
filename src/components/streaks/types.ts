
export interface StreakPost {
  id: string;
  user_id: string;
  content: string[];  // Changed from string to string[] to support multiple images
  caption?: string;
  created_at: string;
  streak_count: number;
  likes_count: number;
  comments_count: number;
  user_name: string;
  user_profile_image?: string;
  expires_at?: string;
}

export interface TopStreak {
  name: string;
  count: number;
}

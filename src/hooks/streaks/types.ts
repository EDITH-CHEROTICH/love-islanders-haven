
export interface StreakData {
  id: string;
  user_id: string;
  content: string[] | string; // Can be string for legacy support or string[] for multiple images
  caption?: string | null;
  created_at: string;
  streak_count: number;
  likes_count: number;
  comments_count: number;
  profiles?: {
    name: string;
  };
  song_title?: string | null;
  song_artist?: string | null;
  song_album_art?: string | null;
  song_preview_url?: string | null;
  expires_at?: string | null;
}

export interface ProfileWithStreak {
  id: string;
  name: string;
  streak_count: [{ streak_count: number }];
}

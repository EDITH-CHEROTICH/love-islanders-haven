
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
  song?: SongData;
}

export interface TopStreak {
  name: string;
  count: number;
}

export interface SongData {
  title: string;
  artist: string;
  album_art?: string;
  preview_url?: string;
}

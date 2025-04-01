
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
  song?: SongData;
  expires_at?: string;
}

export interface TopStreak {
  name: string;
  count: number;
}

export interface SongData {
  title: string;
  artist: string;
  albumArt: string;
  previewUrl: string;
}

export interface SongOption {
  id: string;
  title: string;
  artist: string;
  album_art?: string;
  preview_url?: string;
}

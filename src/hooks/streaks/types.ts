
import { StreakPost, TopStreak, SongData } from "@/components/streaks/types";

// Define Supabase database response types
export interface StreakData {
  id: string;
  user_id: string;
  content: string;
  caption: string | null;
  created_at: string;
  streak_count: number;
  likes_count: number;
  comments_count: number;
  song_title: string | null;
  song_artist: string | null;
  song_album_art: string | null;
  song_preview_url: string | null;
  profiles?: { name: string } | null;
}

export interface ProfileWithStreak {
  id: string;
  name: string;
  streak_count?: Array<{ streak_count: number }>;
}


export interface StreakData {
  id: string;
  user_id: string;
  content: string;
  caption?: string;
  created_at: string;
  streak_count: number;
  likes_count: number;
  comments_count: number;
  expires_at?: string;
  song_title?: string;
  song_artist?: string;
  song_album_art?: string;
  song_preview_url?: string;
  profiles: {
    name: string;
  };
}

export interface CreateStreakParams {
  userId: string;
  content: string[];
  streakCount: number;
  expiresAt: string;
  caption?: string;
}

export interface UserStreakStatus {
  hasPostedToday: boolean;
  streakCount: number;
}

export interface TopStreakUser {
  id: string;
  name: string;
  count: number;
  streak_count: { streak_count: number }[];
}

// Add the missing ProfileWithStreak type
export interface ProfileWithStreak {
  id: string;
  name: string;
  streak_count: { streak_count: number }[];
}

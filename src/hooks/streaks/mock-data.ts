
import { StreakData, ProfileWithStreak } from "./types";
import { StreakPost } from "@/components/streaks/types";

/**
 * Transform database streak data to the format needed for the UI
 */
export const transformStreakData = (streakData: StreakData): StreakPost => {
  return {
    id: streakData.id,
    user_id: streakData.user_id,
    content: streakData.content,
    caption: streakData.caption || undefined,
    created_at: streakData.created_at,
    streak_count: streakData.streak_count,
    likes_count: streakData.likes_count,
    comments_count: streakData.comments_count,
    user_name: streakData.profiles?.name || 'Unknown User',
    user_profile_image: null, // We don't have profile images yet
    song: streakData.song_title ? {
      title: streakData.song_title,
      artist: streakData.song_artist || '',
      album_art: streakData.song_album_art || '',
      preview_url: streakData.song_preview_url || ''
    } : undefined,
    expires_at: streakData.expires_at
  };
};

// Top streaks for empty state
export const getDummyTopStreaks = () => [
  { name: "SarahHiking", count: 14 },
  { name: "JohnRunner", count: 12 },
  { name: "EmilyCook", count: 8 }
];

// Posts for empty state
export const getDummyPosts = (): StreakPost[] => [];

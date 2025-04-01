
import { StreakData, ProfileWithStreak } from "./types";
import { StreakPost } from "@/components/streaks/types";

/**
 * Transform database streak data to the format needed for the UI
 */
export const transformStreakData = (streakData: StreakData): StreakPost => {
  // Handle case where content could be string or string[]
  const contentArray = Array.isArray(streakData.content) 
    ? streakData.content 
    : [streakData.content as string];
    
  return {
    id: streakData.id,
    user_id: streakData.user_id,
    content: contentArray,
    caption: streakData.caption || undefined,
    created_at: streakData.created_at,
    streak_count: streakData.streak_count,
    likes_count: streakData.likes_count || 0,
    comments_count: streakData.comments_count || 0,
    user_name: streakData.profiles?.name || 'Unknown User',
    user_profile_image: null, // We don't have profile images yet
    song: streakData.song_title ? {
      title: streakData.song_title,
      artist: streakData.song_artist || '',
      albumArt: streakData.song_album_art || '',
      previewUrl: streakData.song_preview_url || ''
    } : undefined,
    expires_at: streakData.expires_at
  };
};

// Transform Supabase top streak data for the UI
export const transformTopStreaksData = (profileData: ProfileWithStreak[]) => {
  return profileData.map(profile => ({
    name: profile.name || 'Anonymous',
    count: profile.streak_count?.[0]?.streak_count || 0
  })).filter(streak => streak.count > 0);
};

// Empty state for posts (not using demo data anymore)
export const getDummyPosts = (): StreakPost[] => [];

// Empty tops streaks for fallback
export const getDummyTopStreaks = () => [];


import { StreakPost, TopStreak } from "@/components/streaks/types";

// Empty mock data for streak posts when API fails
export const getDummyPosts = (): StreakPost[] => [];

// Empty mock data for top streaks when API fails
export const getDummyTopStreaks = (): TopStreak[] => [];

// Transform data from API to match StreakPost type
export const transformStreakData = (streakData: any): StreakPost => ({
  id: streakData.id,
  user_id: streakData.user_id,
  content: streakData.content,
  caption: streakData.caption || undefined,
  created_at: streakData.created_at,
  streak_count: streakData.streak_count,
  likes_count: streakData.likes_count || 0,
  comments_count: streakData.comments_count || 0,
  user_name: streakData.profiles?.name || "Unknown User",
  user_profile_image: undefined, // We could fetch this from profile_images in the future
  song: streakData.song_title ? {
    title: streakData.song_title,
    artist: streakData.song_artist || "",
    album_art: streakData.song_album_art || undefined,
    preview_url: streakData.song_preview_url || undefined
  } : undefined,
  expires_at: streakData.expires_at
});

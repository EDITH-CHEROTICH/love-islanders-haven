
import { StreakPost, TopStreak } from "@/components/streaks/types";

// Mock data for streak posts when API fails
export const getDummyPosts = (): StreakPost[] => [
  {
    id: "1",
    user_id: "user1",
    content: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    caption: "Day 5 of my fitness journey! 💪 Feeling stronger every day.",
    created_at: new Date().toISOString(),
    streak_count: 5,
    likes_count: 12,
    comments_count: 3,
    user_name: "Alex Smith",
    user_profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    song: {
      title: "Eye of the Tiger",
      artist: "Survivor",
      album_art: "https://images.unsplash.com/photo-1459305272254-33a7d593a851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    }
  },
  {
    id: "2",
    user_id: "user2",
    content: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    caption: "Beautiful sunset today! Day 10 of sharing my daily moments.",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
    streak_count: 10,
    likes_count: 25,
    comments_count: 5,
    user_name: "Jamie Taylor",
    user_profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "3",
    user_id: "user3",
    content: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    caption: "Exploring the wilderness! Day 15 streak and counting.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    streak_count: 15,
    likes_count: 34,
    comments_count: 7,
    user_name: "Jordan Lee",
    user_profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    song: {
      title: "Born to Be Wild",
      artist: "Steppenwolf",
      album_art: "https://images.unsplash.com/photo-1614149162883-504ce46d75d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    }
  }
];

// Mock data for top streaks when API fails
export const getDummyTopStreaks = (): TopStreak[] => [
  { name: "Jordan Lee", count: 30 },
  { name: "Alex Smith", count: 21 },
  { name: "Jamie Taylor", count: 15 }
];

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
  } : undefined
});

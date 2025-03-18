
import { Profile } from '@/utils/dummyData';
import { supabase } from "@/integrations/supabase/client";

// Weights for different factors in our algorithm
const PREFERENCE_WEIGHT = 0.4;
const BEHAVIOR_WEIGHT = 0.6;

// Simple ML algorithm to calculate compatibility score
export const calculateCompatibilityScore = (
  profile: Profile, 
  userPreferences: any, 
  userBehavior: any
): number => {
  // Base score - starts at 0.5 (50% match)
  let score = 0.5;
  
  // Calculate preference-based score (based on explicit filters)
  const preferenceScore = calculatePreferenceScore(profile, userPreferences);
  
  // Calculate behavior-based score (based on implicit behavior)
  const behaviorScore = calculateBehaviorScore(profile, userBehavior);
  
  // Weighted average of both scores
  score = (preferenceScore * PREFERENCE_WEIGHT) + (behaviorScore * BEHAVIOR_WEIGHT);
  
  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
};

// Calculate score based on explicit preferences (age range, distance, etc)
const calculatePreferenceScore = (profile: Profile, preferences: any): number => {
  if (!preferences) return 0.5;
  
  let score = 0.5;
  
  // Age preference
  if (preferences.minAge && preferences.maxAge) {
    if (profile.age >= preferences.minAge && profile.age <= preferences.maxAge) {
      score += 0.1;
    } else {
      score -= 0.1;
    }
  }
  
  // Interest match (for each matching interest, increase score)
  if (preferences.interests && profile.interests) {
    const matchingInterests = profile.interests.filter(interest => 
      preferences.interests.includes(interest)
    );
    score += (matchingInterests.length / Math.max(profile.interests.length, 1)) * 0.2;
  }
  
  return Math.max(0, Math.min(1, score));
};

// Calculate score based on implicit behavior (likes, message patterns)
const calculateBehaviorScore = (profile: Profile, behavior: any): number => {
  if (!behavior) return 0.5;
  
  let score = 0.5;
  
  // Similar profiles that user has liked before
  if (behavior.likedProfiles && behavior.likedProfiles.length > 0) {
    const similarityScores = behavior.likedProfiles.map((likedProfile: Profile) => 
      calculateProfileSimilarity(profile, likedProfile)
    );
    
    // Average similarity to liked profiles
    const avgSimilarity = similarityScores.reduce(
      (sum: number, score: number) => sum + score, 0
    ) / similarityScores.length;
    
    score += avgSimilarity * 0.3;
  }
  
  return Math.max(0, Math.min(1, score));
};

// Calculate similarity between two profiles
const calculateProfileSimilarity = (profile1: Profile, profile2: Profile): number => {
  let similarity = 0;
  
  // Age similarity
  const ageDiff = Math.abs(profile1.age - profile2.age);
  similarity += (1 - Math.min(ageDiff / 10, 1)) * 0.2;
  
  // Interest similarity
  if (profile1.interests && profile2.interests) {
    const profile1Interests = new Set(profile1.interests);
    const matchingInterests = profile2.interests.filter(interest => 
      profile1Interests.has(interest)
    );
    similarity += (matchingInterests.length / Math.max(
      profile1.interests.length, profile2.interests.length, 1
    )) * 0.4;
  }
  
  return similarity;
};

// Sort profiles based on compatibility scores
export const sortProfilesByCompatibility = (
  profiles: Profile[], 
  userPreferences: any, 
  userBehavior: any
): Profile[] => {
  return [...profiles].sort((a, b) => {
    const scoreA = calculateCompatibilityScore(a, userPreferences, userBehavior);
    const scoreB = calculateCompatibilityScore(b, userPreferences, userBehavior);
    return scoreB - scoreA;
  });
};

// Track user feedback for algorithm improvement
export const trackUserFeedback = async (
  userId: string | undefined,
  profileId: string,
  action: 'like' | 'dislike' | 'superlike' | 'match' | 'message',
  data?: any
) => {
  if (!userId) return;
  
  try {
    // In a real app, we would store this in the database
    console.log(`User ${userId} ${action} profile ${profileId}`, data);
    
    // Store feedback data in Supabase (if authenticated)
    if (supabase.auth.getUser) {
      const user = await supabase.auth.getUser();
      if (user.data.user?.id) {
        // This would be implemented with a proper table structure
        console.log('Feedback data would be stored in Supabase');
      }
    }
  } catch (error) {
    console.error('Error tracking user feedback:', error);
  }
};

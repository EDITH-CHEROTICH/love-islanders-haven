
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/utils/dummyData';

export interface DiscoverFilters {
  ageRange: [number, number];
  distance: number;
  height: [number, number];
  relationshipGoals: string[];
  hasChildren: boolean | null;
  hasPets: boolean | null;
  smoking: string | null;
  education: string | null;
  occupation: string | null;
  interests: string[];
}

export const fetchDiscoverProfiles = async (filters: DiscoverFilters): Promise<Profile[]> => {
  try {
    // Simulate fetching profiles based on filters
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .gte('age', filters.ageRange[0])
      .lte('age', filters.ageRange[1])
      .limit(10);

    if (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }

    // Convert database records to Profile type
    const profiles: Profile[] = (data || []).map(profile => {
      // Create a profile object with required fields
      // Use type assertion to ensure compatibility with Profile type
      return {
        id: profile.id,
        name: profile.name || 'Anonymous',
        age: profile.age || 25,
        bio: profile.bio || 'No bio available',
        distance: Math.floor(Math.random() * filters.distance), // Simulate distance
        occupation: profile.occupation || 'Not specified',
        education: profile.education || 'Not specified',
        images: [], // Initialize with empty array as profile.images doesn't exist
        interests: [], // Initialize with empty array as profile.interests doesn't exist
        relationshipGoal: profile.relationship_goal || 'Not specified',
        height: profile.height || 175,
        gender: profile.gender || 'Not specified',
        lastActive: new Date(),
        verified: Boolean(profile.verified),
        location: profile.location || 'Not specified', // Add location field
        children: profile.has_children ? 'Has children' : 'No children',
        smoking: 'Not specified', // Default value as profile.smoking doesn't exist
        drinking: 'Not specified', // Default value as profile.drinking doesn't exist
        exercise: 'Not specified', // Default value as profile.exercise doesn't exist
        pets: profile.has_pets ? 'Has pets' : 'No pets',
      } as Profile;
    });

    return profiles;
  } catch (error) {
    console.error("Error fetching discover profiles:", error);
    return [];
  }
};

interface SwipeResult {
  success: boolean;
  isMatch: boolean;
}

export const recordSwipeAction = async (profileId: string, action: string): Promise<SwipeResult> => {
  try {
    // Simulate recording a swipe action
    // In a real application, this would involve updating a database
    console.log(`Recording ${action} for profile ${profileId}`);

    // Simulate a match
    const isMatch = Math.random() < 0.1; // 10% chance of a match

    return { success: true, isMatch };
  } catch (error) {
    console.error("Error recording swipe action:", error);
    return { success: false, isMatch: false };
  }
};

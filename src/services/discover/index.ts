
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/utils/dummyData';
import { AdvancedFilterOptions } from '@/components/discover/AdvancedFilters';

// Update DiscoverFilters to match AdvancedFilterOptions
export type DiscoverFilters = AdvancedFilterOptions;

// Conversion helpers
const feetToCm = (feet: number) => Math.round(feet * 30.48);

export const fetchDiscoverProfiles = async (filters: DiscoverFilters): Promise<Profile[]> => {
  try {
    // Convert height range to cm for database query if needed
    let heightMin = filters.height[0];
    let heightMax = filters.height[1];

    // Simulate fetching profiles based on filters
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_images (url, position),
        profile_interests (interests(name))
      `)
      .gte('age', filters.ageRange[0])
      .lte('age', filters.ageRange[1])
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }

    // Convert database records to Profile type
    const profiles: Profile[] = (data || []).map(profile => {
      // Sort images by position
      const images = profile.profile_images 
        ? profile.profile_images
            .sort((a: any, b: any) => a.position - b.position)
            .map((img: any) => img.url)
        : [];

      // Extract interests
      const interests = profile.profile_interests
        ? profile.profile_interests.map((pi: any) => pi.interests?.name).filter(Boolean)
        : [];

      // Create a profile object with required fields
      return {
        id: profile.id,
        name: profile.name || 'Anonymous',
        age: profile.age || 25,
        bio: profile.bio || 'No bio available',
        distance: Math.floor(Math.random() * filters.distance), // Simulate distance
        occupation: profile.occupation || 'Not specified',
        education: profile.education || 'Not specified',
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1964&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1964&auto=format&fit=crop'
        ],
        interests: interests.length > 0 ? interests : ['Travel', 'Music'],
        relationshipGoal: profile.relationship_goal || 'Not specified',
        height: profile.height || 175,
        gender: profile.gender || 'Not specified',
        lastActive: new Date(),
        verified: Boolean(profile.verified),
        location: profile.location || 'Not specified',
        children: profile.has_children ? 'Has children' : 'No children',
        smoking: 'Not specified', // Default value
        drinking: 'Not specified', // Default value
        exercise: 'Not specified', // Default value
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
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    // If user is not authenticated, simulate the action
    if (!userId) {
      console.log(`Simulating ${action} for profile ${profileId} without authentication`);
      return { success: true, isMatch: action === 'right' && Math.random() < 0.2 };
    }

    // Record the swipe in the database
    const isLike = action === 'right';
    
    const { error } = await supabase
      .from('likes')
      .insert({
        liker_id: userId,
        liked_id: profileId,
        is_like: isLike,
        is_super: false // Assuming normal like, not super like
      });

    if (error) {
      console.error("Error recording swipe action:", error);
      return { success: false, isMatch: false };
    }

    // For right swipes, check if there's a match
    if (isLike) {
      const { data: matchData, error: matchError } = await supabase
        .from('likes')
        .select('*')
        .eq('liker_id', profileId)
        .eq('liked_id', userId)
        .eq('is_like', true)
        .maybeSingle();

      if (matchError) {
        console.error("Error checking for match:", matchError);
      }

      return { success: true, isMatch: !!matchData };
    }

    return { success: true, isMatch: false };
  } catch (error) {
    console.error("Error recording swipe action:", error);
    return { success: false, isMatch: false };
  }
};

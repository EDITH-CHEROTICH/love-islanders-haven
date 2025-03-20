
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/utils/dummyData";
import { useAuth } from "@/context/AuthContext";

export const fetchDiscoverProfiles = async (filters: any) => {
  try {
    // Get current user's id and preferences
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Fetch user's profile to get gender preferences
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('gender, gender_preference')
      .eq('id', user.id)
      .single();
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    // Start building the query
    let query = supabase
      .from('profiles')
      .select(`
        id, 
        name, 
        age, 
        location, 
        bio, 
        gender,
        gender_preference,
        verified,
        height,
        height_cm,
        height_unit,
        has_pets,
        pet_type,
        has_children,
        children_count,
        education,
        occupation,
        relationship_goal,
        profile_images (url, position),
        profile_interests (interests(name))
      `)
      .neq('id', user.id);
    
    // Apply gender preference filter
    if (userProfile.gender_preference === 'male') {
      query = query.eq('gender', 'male');
    } else if (userProfile.gender_preference === 'female') {
      query = query.eq('gender', 'female');
    }
    
    // Apply age filter if specified
    if (filters?.ageRange) {
      query = query
        .gte('age', filters.ageRange[0])
        .lte('age', filters.ageRange[1]);
    }
    
    // Apply height filter if specified
    if (filters?.height) {
      query = query
        .gte('height_cm', filters.height[0])
        .lte('height_cm', filters.height[1]);
    }
    
    // Apply relationship goals filter if specified
    if (filters?.relationshipGoals && filters.relationshipGoals.length > 0) {
      query = query.in('relationship_goal', filters.relationshipGoals);
    }
    
    // Apply children filter if specified
    if (filters?.hasChildren !== null) {
      query = query.eq('has_children', filters.hasChildren);
    }
    
    // Apply pets filter if specified
    if (filters?.hasPets !== null) {
      query = query.eq('has_pets', filters.hasPets);
    }
    
    // Apply education filter if specified
    if (filters?.education) {
      query = query.eq('education', filters.education);
    }
    
    // Apply occupation filter if specified
    if (filters?.occupation) {
      query = query.eq('occupation', filters.occupation);
    }
    
    // Exclude profiles that the user has already liked or disliked
    const { data: userActions } = await supabase
      .from('likes')
      .select('liked_id')
      .eq('liker_id', user.id);
    
    if (userActions && userActions.length > 0) {
      const alreadyActedIds = userActions.map(action => action.liked_id);
      query = query.not('id', 'in', `(${alreadyActedIds.join(',')})`);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
    
    // Format the data to match our Profile type
    const profiles = data.map(p => {
      const interests = p.profile_interests ? 
        p.profile_interests.map((pi: any) => pi.interests.name) : [];
      
      const images = p.profile_images ? 
        p.profile_images.sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url) : [];
      
      const relationshipGoal = p.relationship_goal as "long-term" | "casual" | "both" | undefined;
      
      return {
        id: p.id,
        name: p.name,
        age: p.age,
        location: p.location || 'Unknown location',
        bio: p.bio || '',
        images: images.length > 0 ? images : ['https://via.placeholder.com/400x600?text=No+Image'],
        interests,
        verified: p.verified || false,
        gender: p.gender,
        genderPreference: p.gender_preference,
        relationshipGoal: relationshipGoal || 'both',
        education: p.education,
        height: p.height,
        heightCm: p.height_cm,
        heightUnit: p.height_unit,
        hasPets: p.has_pets,
        petType: p.pet_type,
        hasChildren: p.has_children,
        childrenCount: p.children_count,
        occupation: p.occupation
      };
    }) as Profile[];
    
    return profiles;
  } catch (error) {
    console.error('Error in fetchDiscoverProfiles:', error);
    throw error;
  }
};

export const recordSwipeAction = async (
  profileId: string, 
  action: 'like' | 'dislike' | 'superlike'
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    if (action === 'dislike') {
      // For dislikes, we just record it to avoid showing the profile again
      const { error } = await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: profileId,
          is_like: false
        });
      
      if (error) {
        console.error('Error recording dislike:', error);
        throw error;
      }
      
      return { action: 'dislike', success: true };
    } else {
      // For likes and superlikes
      const isSuper = action === 'superlike';
      
      const { data, error } = await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: profileId,
          is_like: true,
          is_super: isSuper
        })
        .select();
      
      if (error) {
        console.error(`Error recording ${action}:`, error);
        throw error;
      }
      
      // Check if it resulted in a match
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .or(`user1_id.eq.${profileId},user2_id.eq.${profileId}`)
        .single();
      
      const isMatch = !matchError && matchData;
      
      return { 
        action, 
        success: true, 
        isMatch, 
        matchId: isMatch ? matchData.id : null
      };
    }
  } catch (error) {
    console.error('Error in recordSwipeAction:', error);
    throw error;
  }
};

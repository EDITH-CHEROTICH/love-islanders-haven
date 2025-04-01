
import { supabase } from "@/integrations/supabase/client";
import { ProfileWithStreak } from "../types";

// Fetch top streak users with proper error handling
export const fetchTopStreaks = async () => {
  try {
    // Get profiles with highest streak counts
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, streak_count')
      .order('streak_count', { ascending: false })
      .gt('streak_count', 0) // Only get profiles with streak count > 0
      .limit(3);
      
    if (error) {
      console.error("Error fetching top streaks:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform the data to match our ProfileWithStreak type
    return data.map(profile => ({
      id: profile.id,
      name: profile.name || 'Anonymous User',
      streak_count: [{ streak_count: profile.streak_count || 0 }]
    })) as ProfileWithStreak[];
  } catch (error) {
    console.error("Error in fetchTopStreaks:", error);
    return [];
  }
};

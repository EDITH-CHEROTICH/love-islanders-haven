
import { supabase } from "@/integrations/supabase/client";
import { ProfileWithStreak } from "../types";

// Fetch top streak users
export const fetchTopStreaks = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, streak_count')
      .order('streak_count', { ascending: false })
      .limit(3);
      
    if (error) {
      console.error("Error fetching top streaks:", error);
      throw error;
    }
    
    // Transform the data to match our ProfileWithStreak type
    return data.map(profile => ({
      id: profile.id,
      name: profile.name,
      streak_count: [{ streak_count: profile.streak_count || 0 }]
    })) as ProfileWithStreak[];
  } catch (error) {
    console.error("Error in fetchTopStreaks:", error);
    return [];
  }
};

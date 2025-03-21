
// Service for retrieving user data
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";
import { retrieveRelevantMemories } from '../utils/userContext.ts';

// Initialize Supabase client
export function initializeSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials");
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Fetch user context data (memory and profile info)
export async function fetchUserContextData(supabase, userId) {
  try {
    if (!userId) {
      return {
        userMemoryContext: '',
        userProfile: null,
        userStreakActivity: []
      };
    }

    console.log("Fetching context data for user:", userId);
    
    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_images (url, position),
        profile_interests (interests(name))
      `)
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }
    
    // Format profile interests if available
    let interests = [];
    if (userProfile?.profile_interests) {
      interests = userProfile.profile_interests.map(pi => pi.interests.name);
    }
    
    // Create a formatted user profile
    const formattedProfile = userProfile ? {
      ...userProfile,
      interests: interests
    } : null;
    
    // Fetch recent conversation for context retrieval
    const { data: recentMessages, error: messagesError } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (messagesError) {
      console.error("Error fetching recent messages:", messagesError);
    }
    
    // Retrieve relevant memories using embeddings
    let userMemoryContext = '';
    if (recentMessages && recentMessages.length > 0) {
      // Format messages for memory retrieval
      const formattedMessages = recentMessages.map(msg => ({
        role: msg.role,
        content: msg.message_content
      })).reverse();
      
      // Initialize OpenAI client (will be passed from the caller)
      const openaiClient = null; // This will be passed from aiConversationService.ts
      
      // We'll fetch memories in aiConversationService.ts instead
      userMemoryContext = ''; // Will be populated later
    }
    
    // Get streak activity for recommendations
    const { data: userStreakActivity, error: streakError } = await supabase.rpc(
      'get_user_streak_activity',
      { user_id: userId }
    );
    
    if (streakError) {
      console.error("Error fetching user streak activity:", streakError);
    }
    
    return {
      userMemoryContext,
      userProfile: formattedProfile,
      userStreakActivity: userStreakActivity || []
    };
  } catch (error) {
    console.error("Error in fetchUserContextData:", error);
    return {
      userMemoryContext: '',
      userProfile: null,
      userStreakActivity: []
    };
  }
}

// Update user memory context with conversation
export async function fetchMemoryContext(supabase, userId, openaiClient, recentMessages) {
  try {
    if (!userId || !openaiClient || !recentMessages || recentMessages.length === 0) {
      return '';
    }
    
    // Format messages for memory retrieval
    const formattedMessages = recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Retrieve memories using embeddings
    const memories = await retrieveRelevantMemories(supabase, userId, openaiClient, formattedMessages);
    return memories;
    
  } catch (error) {
    console.error("Error fetching memory context:", error);
    return '';
  }
}

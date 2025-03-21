
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";
import OpenAI from "https://esm.sh/openai@4.24.1";

// Import necessary services and utilities
import { generateProactiveMessage } from "../ai-companion/utils/aiService.ts";
import { retrieveRelevantMemories } from "../ai-companion/utils/userContext.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Initialize OpenAI
    const API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!API_KEY || API_KEY.trim() === '') {
      throw new Error("No OpenAI API key found");
    }
    
    const openaiClient = new OpenAI({
      apiKey: API_KEY,
    });

    // Get request parameters
    let { userId } = await req.json();
    
    if (!userId) {
      // If no specific user ID is provided, find users who have AI companion settings enabled
      const { data: eligibleUsers, error: usersError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('ai_companion_settings->allowProactiveMessages', true);
        
      if (usersError) {
        throw new Error(`Error fetching eligible users: ${usersError.message}`);
      }
      
      if (!eligibleUsers || eligibleUsers.length === 0) {
        return new Response(JSON.stringify({ 
          message: "No eligible users found with proactive messaging enabled" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }
      
      // Select a random user from eligible users
      const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
      userId = eligibleUsers[randomIndex].id;
    }
    
    console.log(`Generating proactive message for user: ${userId}`);
    
    // Get user profile and settings
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
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }
    
    // Get user AI settings to check frequency
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('ai_companion_settings')
      .eq('id', userId)
      .maybeSingle();
      
    if (settingsError || !userSettings) {
      throw new Error(`Error fetching user settings: ${settingsError?.message || "No settings found"}`);
    }
    
    // Check if proactive messaging is enabled for this user
    if (!userSettings.ai_companion_settings?.allowProactiveMessages) {
      return new Response(JSON.stringify({ 
        message: "Proactive messaging disabled for this user" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    // Get last message timestamp
    const { data: lastMessage, error: lastMessageError } = await supabase
      .from('ai_chat_history')
      .select('created_at')
      .eq('user_id', userId)
      .eq('role', 'assistant')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (lastMessageError) {
      throw new Error(`Error fetching last message timestamp: ${lastMessageError.message}`);
    }
    
    // Check if enough time has passed since the last message based on user preference
    if (lastMessage) {
      const lastMessageDate = new Date(lastMessage.created_at);
      const messageFrequency = userSettings.ai_companion_settings?.messageFrequency || 24; // Default to 24 hours
      const requiredHoursPassed = messageFrequency;
      
      const hoursPassed = (new Date().getTime() - lastMessageDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursPassed < requiredHoursPassed) {
        return new Response(JSON.stringify({ 
          message: `Not enough time passed since last message (${hoursPassed.toFixed(1)} hours, need ${requiredHoursPassed})` 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }
    }
    
    // Get recent conversations for context
    const { data: recentMessages, error: messagesError } = await supabase
      .from('ai_chat_history')
      .select('role, message_content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (messagesError) {
      throw new Error(`Error fetching recent messages: ${messagesError.message}`);
    }
    
    // Format conversation for context
    const formattedConversation = recentMessages
      ? recentMessages.map(msg => ({
          role: msg.role,
          content: msg.message_content
        })).reverse()
      : [];
    
    // Retrieve relevant memory context
    const memoryContext = await retrieveRelevantMemories(
      supabase, 
      userId, 
      openaiClient, 
      formattedConversation
    );
    
    // Generate a proactive message
    const proactiveMessage = await generateProactiveMessage(
      openaiClient,
      userProfile,
      memoryContext,
      formattedConversation
    );
    
    // Store the proactive message
    const { error: insertError } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        role: 'assistant',
        message_content: proactiveMessage,
        message_type: 'proactive'
      });
      
    if (insertError) {
      throw new Error(`Error storing proactive message: ${insertError.message}`);
    }
    
    // Also insert a notification for the user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'message',
        content: 'Isla sent you a message',
        is_read: false
      });
      
    if (notificationError) {
      console.error(`Error creating notification: ${notificationError.message}`);
      // Continue execution even if notification creation fails
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Proactive message sent successfully",
      content: proactiveMessage,
      userId: userId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error in proactive messaging function:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unknown error occurred" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

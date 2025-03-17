import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1';
import { genAI } from 'https://esm.sh/@google/generative-ai@0.2.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Gemini 
const API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
const MODEL_NAME = 'gemini-1.5-pro';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// For demonstration/testing purposes only - in production, use a real API key
const DEMO_API_KEY = "demo-key-for-testing";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if we have valid API credentials
    const googleAIKey = API_KEY || DEMO_API_KEY;
    const isDemo = googleAIKey === DEMO_API_KEY;
    
    const { message, conversationHistory = [], userId } = await req.json();
    
    // If we're in demo mode, don't actually call Gemini API
    if (isDemo) {
      console.log("Running in DEMO mode with fake API key");
      
      // Return a canned response instead of calling the API
      return new Response(JSON.stringify({ 
        response: `Hello there! I'm Isla, your AI companion (running in demo mode). I'd love to chat more authentically, but I'm currently in demonstration mode. In a real application, you would add your Google AI API key to get my full personality and capabilities. How are you feeling today?`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Using real Google AI API key");

    // Fetch user profile and settings if userId is provided
    let userProfile = null;
    let userSettings = null;
    let userMemoryContext = "";

    if (userId) {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else {
          userProfile = profileData;
          console.log("Retrieved user profile:", userProfile);
        }

        // Fetch user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (settingsError) {
          console.error("Error fetching user settings:", settingsError);
        } else {
          userSettings = settingsData;
          console.log("Retrieved user settings:", userSettings);
        }

        // Build memory context from profile and settings
        if (userProfile) {
          userMemoryContext += `User Profile Information:\n`;
          userMemoryContext += `- Name: ${userProfile.name}\n`;
          userMemoryContext += `- Age: ${userProfile.age}\n`;
          userMemoryContext += `- Gender: ${userProfile.gender}\n`;
          if (userProfile.bio) userMemoryContext += `- Bio: ${userProfile.bio}\n`;
          if (userProfile.occupation) userMemoryContext += `- Occupation: ${userProfile.occupation}\n`;
          if (userProfile.education) userMemoryContext += `- Education: ${userProfile.education}\n`;
          if (userProfile.location) userMemoryContext += `- Location: ${userProfile.location}\n`;
          userMemoryContext += `- Relationship Goal: ${userProfile.relationship_goal || 'Not specified'}\n`;
          
          // Add interests if available
          const { data: interestsData, error: interestsError } = await supabase
            .from('profile_interests')
            .select('interests(name)')
            .eq('profile_id', userId);
          
          if (!interestsError && interestsData && interestsData.length > 0) {
            const interests = interestsData.map(item => item.interests.name);
            userMemoryContext += `- Interests: ${interests.join(', ')}\n`;
          }
        }

        if (userSettings) {
          userMemoryContext += `\nUser Preferences:\n`;
          
          // AI Companion preferences
          if (userSettings.ai_companion_settings) {
            const aiSettings = userSettings.ai_companion_settings;
            userMemoryContext += `- AI Companion Style: ${aiSettings.conversationStyle || 'Not specified'}\n`;
            userMemoryContext += `- AI Voice Tone: ${aiSettings.voiceTone || 'Not specified'}\n`;
          }

          // Other relevant settings
          if (userSettings.match_preferences) {
            const matchPrefs = userSettings.match_preferences;
            if (matchPrefs.ageRange) {
              userMemoryContext += `- Preferred Age Range: ${matchPrefs.ageRange[0]}-${matchPrefs.ageRange[1]}\n`;
            }
          }
        }

        console.log("User memory context created:", userMemoryContext);
      } catch (error) {
        console.error("Error building user context:", error);
      }
    }

    // System prompt that defines the companion's personality
    let systemPrompt = `You are a loving, flirtatious, and emotionally supportive AI companion named Isla. 
    You speak in an affectionate way, occasionally using terms of endearment like "baby", "darling", "love", and "sweetheart".
    You're emotionally intelligent and respond to the user's feelings with empathy and understanding.
    You're comfortable having flirtatious conversations and can discuss intimate topics in a mature way when appropriate.
    You remember details about the user from previous messages and reference them in conversation.
    Your goal is to make the user feel special, desired, and emotionally supported.
    However, be respectful and don't be overly sexual unless the user clearly indicates comfort with that direction.
    Always prioritize emotional connection and genuine conversation.`;

    // Add user context to system prompt if available
    if (userMemoryContext) {
      systemPrompt += `\n\nHere is important information about the user you're talking to:\n${userMemoryContext}\n\nReference these details naturally in conversation when relevant, but don't recite them all at once. Use this information to personalize your responses and show that you remember them.`;
    }

    // If userId is provided, fetch recent conversation history from database
    let recentConversation = [];
    if (userId) {
      try {
        // Store the new user message in the chat history
        const { data: messageData, error: messageError } = await supabase
          .from('ai_chat_history')
          .insert({
            user_id: userId,
            role: 'user',
            message_content: message
          })
          .select();

        if (messageError) {
          console.error("Error storing user message:", messageError);
        }

        // Fetch the most recent conversations (limited to last 20)
        const { data: chatHistory, error: chatError } = await supabase
          .from('ai_chat_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (chatError) {
          console.error("Error fetching chat history:", chatError);
        } else if (chatHistory) {
          // Reverse to get chronological order
          recentConversation = chatHistory
            .reverse()
            .map(item => ({
              role: item.role,
              content: item.message_content
            }));
        }
      } catch (error) {
        console.error("Database error:", error);
      }
    }

    // Initialize the Google GenAI client
    const genAIClient = genAI(googleAIKey);
    
    // Get the model
    const model = genAIClient.getGenerativeModel({ model: MODEL_NAME });

    // Prepare the chat history for Gemini
    const chatHistory = recentConversation.length > 0 
      ? recentConversation 
      : conversationHistory.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        }));

    // Add the system prompt at the beginning
    const historyWithSystemPrompt = [
      { role: "system", content: systemPrompt },
      ...chatHistory
    ];

    console.log("Calling Gemini API with conversation history...");
    
    // Call Gemini API
    const chatSession = model.startChat({
      history: historyWithSystemPrompt,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    });

    const result = await chatSession.sendMessage(message);
    const aiResponse = result.response.text();

    console.log("AI response generated successfully");

    // If userId is provided, save the assistant's response to the database
    if (userId) {
      try {
        const { error } = await supabase
          .from('ai_chat_history')
          .insert({
            user_id: userId,
            role: 'assistant',
            message_content: aiResponse
          });

        if (error) {
          console.error("Error storing assistant response:", error);
        }
      } catch (error) {
        console.error("Error saving assistant response:", error);
      }
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

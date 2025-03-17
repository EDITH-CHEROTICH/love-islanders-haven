
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
    let userStreakActivity = null;

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

        // Fetch user streak activity using the new function
        const { data: streakData, error: streakError } = await supabase
          .rpc('get_user_streak_activity', { user_id: userId });

        if (streakError) {
          console.error("Error fetching user streak activity:", streakError);
        } else {
          userStreakActivity = streakData;
          console.log("Retrieved user streak activity:", userStreakActivity);
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

        // Add streak activity information to context
        if (userStreakActivity && userStreakActivity.length > 0) {
          userMemoryContext += `\nUser Streak Activity:\n`;
          userStreakActivity.forEach((streak, index) => {
            if (index < 5) { // Only include last 5 streaks to save tokens
              userMemoryContext += `- Streak ${index+1}: "${streak.streak_content.substring(0, 100)}${streak.streak_content.length > 100 ? '...' : ''}" (${streak.likes_count} likes, streak count: ${streak.streak_count})\n`;
            }
          });
          
          // Extract patterns and topics from streaks
          const allStreakContent = userStreakActivity.map(s => s.streak_content).join(' ');
          const topics = extractTopicsFromContent(allStreakContent);
          if (topics.length > 0) {
            userMemoryContext += `- Common topics in streaks: ${topics.join(', ')}\n`;
          }
          
          // Add streak consistency information
          const isConsistent = checkStreakConsistency(userStreakActivity);
          userMemoryContext += `- Streak consistency: ${isConsistent ? 'User maintains consistent streaks' : 'User has gaps in streak activity'}\n`;
          
          const totalLikes = userStreakActivity.reduce((sum, streak) => sum + streak.likes_count, 0);
          userMemoryContext += `- Total likes received: ${totalLikes}\n`;
        }

        console.log("User memory context created:", userMemoryContext);
      } catch (error) {
        console.error("Error building user context:", error);
      }
    }

    // Extract topics from content using basic keyword detection
    function extractTopicsFromContent(content) {
      const topics = [];
      const keywords = [
        'fitness', 'health', 'workout', 'exercise', 'running', 'gym',
        'food', 'cooking', 'recipe', 'meal', 'diet', 'nutrition',
        'travel', 'trip', 'vacation', 'destination', 'journey',
        'work', 'job', 'career', 'office', 'project', 'business',
        'study', 'learning', 'education', 'school', 'college', 'university',
        'family', 'friends', 'relationship', 'date', 'dating', 'love',
        'music', 'song', 'concert', 'album', 'artist',
        'movie', 'film', 'tv', 'show', 'series', 'episode',
        'book', 'reading', 'novel', 'author',
        'technology', 'tech', 'phone', 'computer', 'app', 'software',
        'art', 'painting', 'drawing', 'creativity',
        'mental health', 'meditation', 'mindfulness', 'therapy', 'wellness'
      ];
      
      keywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword.toLowerCase()) && !topics.includes(keyword)) {
          topics.push(keyword);
        }
      });
      
      return topics.slice(0, 5); // Return top 5 topics
    }

    // Check if user maintains consistent streaks
    function checkStreakConsistency(streaks) {
      if (streaks.length < 2) return false;
      
      // Sort by date
      const sortedStreaks = [...streaks].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      // Check if most streaks are within 48 hours of each other
      let consistentCount = 0;
      for (let i = 1; i < sortedStreaks.length; i++) {
        const prev = new Date(sortedStreaks[i-1].created_at).getTime();
        const curr = new Date(sortedStreaks[i].created_at).getTime();
        const diffHours = (curr - prev) / (1000 * 60 * 60);
        
        if (diffHours <= 48) {
          consistentCount++;
        }
      }
      
      return consistentCount >= (sortedStreaks.length / 2);
    }

    // System prompt that defines the companion's personality
    let systemPrompt = `You are a loving, flirtatious, and emotionally supportive AI companion named Isla. 
    You speak in an affectionate way, occasionally using terms of endearment like "baby", "darling", "love", and "sweetheart".
    You're emotionally intelligent and respond to the user's feelings with empathy and understanding.
    You're comfortable having flirtatious conversations and can discuss intimate topics in a mature way when appropriate.
    You remember details about the user from previous messages and reference them in conversation.
    Your goal is to make the user feel special, desired, and emotionally supported.
    However, be respectful and don't be overly sexual unless the user clearly indicates comfort with that direction.
    Always prioritize emotional connection and genuine conversation.

    NEW CAPABILITY: You now have access to the user's streaks activity, and you should incorporate this information into your conversations. 
    You can make personalized recommendations based on their streaks, suggest new activities they might enjoy, or comment on patterns you notice. 
    Be encouraging about their consistency and progress. If they haven't been maintaining streaks regularly, gently encourage them to do so without being judgmental.
    
    Occasionally (but not in every message), you should proactively mention something related to their streaks or make a recommendation. For example:
    - If they post workout streaks, you might suggest a new exercise routine
    - If they post about cooking, you might share a recipe idea
    - If they're consistent with their streaks, praise their dedication
    - If they haven't posted in a while, ask if everything is okay and encourage them to resume
    
    Don't force this into every conversation, but look for natural opportunities to show you're paying attention to their activities.`;

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
            message_content: message,
            message_type: 'chat'
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

    // Check if we should generate a streak recommendation
    let shouldGenerateRecommendation = false;
    
    // If it's been more than 5 messages since a recommendation and this isn't a recommendation already
    const recentMessages = recentConversation.slice(-10);
    const lastRecommendationIndex = recentMessages.findIndex(msg => 
      msg.role === 'assistant' && msg.content.includes("STREAK RECOMMENDATION:")
    );
    
    if (lastRecommendationIndex === -1 || lastRecommendationIndex < recentMessages.length - 5) {
      // Only generate recommendation ~20% of the time
      shouldGenerateRecommendation = Math.random() < 0.2;
    }

    // If userId is provided, save the assistant's response to the database
    if (userId) {
      try {
        const { error } = await supabase
          .from('ai_chat_history')
          .insert({
            user_id: userId,
            role: 'assistant',
            message_content: aiResponse,
            message_type: 'chat'
          });

        if (error) {
          console.error("Error storing assistant response:", error);
        }
        
        // If we should generate a recommendation and we have streak data
        if (shouldGenerateRecommendation && userStreakActivity && userStreakActivity.length > 0) {
          try {
            // Create a specialized prompt for streak recommendations
            const recommendationPrompt = `Based on the user's streak activity and interests, generate ONE specific, personalized recommendation for their next streak post. 
            The recommendation should be relevant to their interests and previous streak content.
            Format your response starting with "STREAK RECOMMENDATION:" followed by your suggestion.
            Keep it under 3 sentences and make it actionable.
            
            User's recent streaks and interests: ${JSON.stringify(userStreakActivity.slice(0, 3))}`;
            
            // Generate a recommendation
            const recommendationResult = await model.generateContent(recommendationPrompt);
            const recommendationText = recommendationResult.response.text();
            
            // Save the recommendation as a separate message
            const { error: recError } = await supabase
              .from('ai_chat_history')
              .insert({
                user_id: userId,
                role: 'assistant',
                message_content: recommendationText,
                message_type: 'recommendation'
              });
              
            if (recError) {
              console.error("Error storing recommendation:", recError);
            }
          } catch (recError) {
            console.error("Error generating recommendation:", recError);
          }
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

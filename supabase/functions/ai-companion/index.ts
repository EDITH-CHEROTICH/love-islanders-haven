
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1';
import { genAI } from 'https://esm.sh/@google/generative-ai@0.2.1';

// Import utility functions
import { 
  fetchUserProfile, 
  fetchUserSettings, 
  fetchUserStreakActivity,
  fetchUserInterests,
  buildUserMemoryContext 
} from './utils/userContext.ts';

import {
  fetchRecentConversation,
  saveUserMessage,
  saveAssistantResponse,
  prepareSystemPrompt,
  shouldGenerateRecommendation
} from './utils/chatHistory.ts';

import {
  generateAIResponse,
  generateRecommendation,
  getDemoResponse
} from './utils/aiService.ts';

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if we have valid API credentials
    if (!API_KEY) {
      console.log("No Google AI API key found in environment variables");
      
      // Return a canned response instead of calling the API
      return new Response(JSON.stringify({ 
        response: getDemoResponse()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Using Google AI API key");
    const { message, conversationHistory = [], userId } = await req.json();

    // Fetch user profile and settings if userId is provided
    let userProfile = null;
    let userSettings = null;
    let userStreakActivity = null;
    let userMemoryContext = "";
    let userInterests = [];

    if (userId) {
      try {
        // Fetch user data
        userProfile = await fetchUserProfile(supabase, userId);
        userSettings = await fetchUserSettings(supabase, userId);
        userStreakActivity = await fetchUserStreakActivity(supabase, userId);
        
        // Fetch user interests if profile exists
        if (userProfile) {
          userInterests = await fetchUserInterests(supabase, userId);
        }
        
        // Build memory context from profile and settings
        userMemoryContext = buildUserMemoryContext(
          userProfile, 
          userSettings, 
          userStreakActivity, 
          userInterests
        );
      } catch (error) {
        console.error("Error building user context:", error);
      }
    }

    // If userId is provided, fetch recent conversation history from database
    let recentConversation = [];
    if (userId) {
      try {
        // Store the new user message in the chat history
        await saveUserMessage(supabase, userId, message);
        
        // Fetch recent conversation
        recentConversation = await fetchRecentConversation(supabase, userId);
      } catch (error) {
        console.error("Database error:", error);
      }
    }

    // Initialize the Google GenAI client
    const genAIClient = genAI(API_KEY);
    
    // Prepare the chat history for Gemini
    const chatHistory = recentConversation.length > 0 
      ? recentConversation 
      : conversationHistory.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        }));

    // Create system prompt
    const systemPrompt = prepareSystemPrompt(userMemoryContext);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(
        genAIClient, 
        MODEL_NAME, 
        systemPrompt, 
        chatHistory, 
        message
      );

      // If userId is provided, save the assistant's response to the database
      if (userId) {
        try {
          await saveAssistantResponse(supabase, userId, aiResponse, 'chat');
          
          // Check if we should generate a recommendation
          const shouldRecommend = shouldGenerateRecommendation(recentConversation);
          
          // If we should generate a recommendation and we have streak data
          if (shouldRecommend && userStreakActivity && userStreakActivity.length > 0) {
            try {
              // Get the model
              const model = genAIClient.getGenerativeModel({ model: MODEL_NAME });
              
              // Generate a recommendation
              const recommendationText = await generateRecommendation(model, userStreakActivity);
              
              // Save the recommendation as a separate message
              await saveAssistantResponse(supabase, userId, recommendationText, 'recommendation');
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
    } catch (aiError) {
      console.error("AI generation error:", aiError);
      return new Response(JSON.stringify({ 
        error: "AI generation failed", 
        message: aiError.message,
        response: "I'm sorry, I encountered an error while processing your request. Please try again in a moment."
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I encountered an unexpected error. Please try again later."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

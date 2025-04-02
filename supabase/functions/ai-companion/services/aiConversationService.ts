
// Service for handling AI conversations
import { 
  fetchRecentConversation,
  saveUserMessage,
  saveAssistantResponse,
  shouldGenerateRecommendation,
  prepareSystemPrompt
} from '../utils/chatHistory.ts';

import { generateAIResponse, getDemoResponse } from '../utils/aiService.ts';

import {
  storeConversationMemory
} from '../utils/userContext.ts';

import OpenAI from "https://esm.sh/openai@4.24.1";

// Process chat messages with OpenAI
export async function processConversationWithN8n(
  message: string, 
  conversationHistory: any[], 
  userId: string | undefined,
  supabase: any,
  userMemoryContext: string,
  userStreakActivity: any[],
  userProfile: any = null,
  userEmail: string | null = null
) {
  // First try to use n8n webhook if configured
  const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
  
  // Get OpenAI API key
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    console.log("No OpenAI API key found, falling back to demo mode");
    return { response: getDemoResponse(false), demo: true };
  }
  
  // Initialize OpenAI client
  const openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY
  });
  
  // If userId is provided, store message and fetch conversation
  let recentConversation = [];
  let chatMessages = [];
  
  // Try to fetch user email if userId is provided and email wasn't passed
  if (userId) {
    try {
      // Store the new user message in the chat history
      await saveUserMessage(supabase, userId, message);
      
      // Fetch recent conversation
      recentConversation = await fetchRecentConversation(supabase, userId);
      
      // Save the full conversation history for context
      chatMessages = [...recentConversation];
      
      // Try to fetch user email if not provided
      if (!userEmail && supabase) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
        if (!userError && userData && userData.user) {
          userEmail = userData.user.email;
          console.log(`Found email for user ${userId}: ${userEmail}`);
        } else {
          console.log(`Could not find email for user ${userId}:`, userError);
        }
      }
    } catch (error) {
      console.error("Database error:", error);
    }
  }
  
  // Prepare the chat history for OpenAI
  const chatHistory = recentConversation.length > 0 
    ? recentConversation 
    : conversationHistory;

  try {
    // Try using n8n webhook first if available
    if (N8N_WEBHOOK_URL && N8N_WEBHOOK_URL.trim() !== '') {
      try {
        console.log("Attempting to use n8n webhook:", N8N_WEBHOOK_URL.substring(0, 15) + "...");
        
        // Prepare payload for n8n webhook
        const payload = {
          message,
          conversationHistory: chatHistory,
          userProfile,
          userMemoryContext,
          userStreakActivity,
          userId,
          userEmail,
          timestamp: new Date().toISOString()
        };
        
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        // Check for non-200 responses
        if (!response.ok) {
          throw new Error(`n8n webhook returned status: ${response.status}`);
        }

        // Parse the result
        const result = await response.json();
        console.log("Received result from n8n:", typeof result);
        
        // Check if the result contains a response field
        const aiResponse = result.response || 
                          (typeof result === 'string' ? result : null);
        
        if (aiResponse) {
          console.log("Using AI response from n8n:", aiResponse.substring(0, 50) + "...");
          
          // If userId is provided, save the assistant's response
          if (userId) {
            saveAndProcessResponse(supabase, userId, aiResponse, chatMessages, userStreakActivity, recentConversation);
          }
          
          return { response: aiResponse };
        } else {
          throw new Error("No valid response from n8n webhook");
        }
      } catch (n8nError) {
        console.error("Error with n8n webhook, falling back to direct OpenAI call:", n8nError);
        // Continue to OpenAI fallback below
      }
    }
    
    // Use direct OpenAI call as fallback or primary method
    console.log("Using direct OpenAI call with GPT-4o");
    
    // Generate system prompt based on user context
    const systemPrompt = prepareSystemPrompt(userMemoryContext, userProfile);
    
    // Call OpenAI
    const aiResponse = await generateAIResponse(
      openaiClient, 
      systemPrompt, 
      chatHistory, 
      message
    );
    
    console.log("Generated response from OpenAI:", aiResponse?.substring(0, 50) + "...");
    
    // If userId is provided, save the assistant's response
    if (userId) {
      await saveAndProcessResponse(supabase, userId, aiResponse, chatMessages, userStreakActivity, recentConversation);
    }
    
    return { response: aiResponse };
  } catch (error) {
    console.error("Error calling AI service:", error);
    // Return detailed error message to help with debugging
    return { 
      response: `I'm having trouble connecting to my AI capabilities right now. The specific error was: ${error.message}. Please try again in a moment.`, 
      error: true 
    };
  }
}

// Helper function to save and process AI response
async function saveAndProcessResponse(
  supabase, 
  userId, 
  aiResponse, 
  chatMessages, 
  userStreakActivity, 
  recentConversation
) {
  try {
    await saveAssistantResponse(supabase, userId, aiResponse, 'chat');
    
    // Update chat messages with the new response for memory storage
    chatMessages.push({ role: 'assistant', content: aiResponse });
    
    // Store conversation memory
    if (chatMessages.length >= 3) {
      try {
        await storeConversationMemory(supabase, userId, null, chatMessages);
      } catch (memoryError) {
        console.error("Error storing conversation memory:", memoryError);
      }
    }
    
    // Check if we should generate a recommendation
    const shouldRecommend = shouldGenerateRecommendation(recentConversation);
    
    // If we should generate a recommendation and we have streak data
    if (shouldRecommend && userStreakActivity && userStreakActivity.length > 0) {
      // We could generate recommendations here, but will skip for now
      console.log("Skipping recommendation generation for now");
    }
  } catch (error) {
    console.error("Error saving and processing response:", error);
  }
}

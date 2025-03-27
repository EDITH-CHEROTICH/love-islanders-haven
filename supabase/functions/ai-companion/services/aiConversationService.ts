// Service for handling AI conversations
import { 
  fetchRecentConversation,
  saveUserMessage,
  saveAssistantResponse,
  shouldGenerateRecommendation
} from '../utils/chatHistory.ts';

import { getDemoResponse } from '../utils/aiService.ts';

import {
  storeConversationMemory
} from '../utils/userContext.ts';

// Process chat messages with n8n
export async function processConversationWithN8n(
  message: string, 
  conversationHistory: any[], 
  userId: string | undefined,
  supabase: any,
  userMemoryContext: string,
  userStreakActivity: any[],
  userProfile: any = null
) {
  // Get the n8n webhook URL from environment variables
  const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
  
  // Check for n8n webhook URL
  if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.trim() === '') {
    console.log("No n8n webhook URL found in environment variables");
    return { response: getDemoResponse(true), demo: true };
  }
  
  console.log("Using n8n webhook URL:", N8N_WEBHOOK_URL.substring(0, 15) + "...");
  
  // If userId is provided, store message and fetch conversation
  let recentConversation = [];
  let chatMessages = [];
  if (userId) {
    try {
      // Store the new user message in the chat history
      await saveUserMessage(supabase, userId, message);
      
      // Fetch recent conversation
      recentConversation = await fetchRecentConversation(supabase, userId);
      
      // Save the full conversation history for context
      chatMessages = [...recentConversation];
    } catch (error) {
      console.error("Database error:", error);
    }
  }
  
  // Prepare the chat history for n8n
  const chatHistory = recentConversation.length > 0 
    ? recentConversation 
    : conversationHistory;

  try {
    // Call n8n webhook with message and context
    console.log("Sending request to n8n webhook");
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory: chatHistory,
        userProfile,
        userMemoryContext,
        userStreakActivity
      })
    });

    if (!response.ok) {
      throw new Error(`n8n webhook returned status: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.response || "Sorry, I couldn't generate a response at this time.";
    
    console.log("Received response from n8n:", aiResponse.substring(0, 50) + "...");

    // If userId is provided, save the assistant's response
    if (userId) {
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
          try {
            // We could call another n8n webhook for recommendations here
            // For now, we'll skip this functionality
            console.log("Skipping recommendation generation for now");
          } catch (recError) {
            console.error("Error generating recommendation:", recError);
          }
        }
      } catch (error) {
        console.error("Error saving assistant response:", error);
      }
    }

    return { response: aiResponse };
  } catch (error) {
    console.error("Error calling n8n webhook:", error);
    return { response: "I'm having trouble connecting to my services right now. Please try again in a moment.", error: true };
  }
}

// Keep the original processConversation function
export async function processConversation(
  message: string, 
  conversationHistory: any[], 
  userId: string | undefined,
  supabase: any,
  userMemoryContext: string,
  userStreakActivity: any[],
  userProfile: any = null
) {
  // Initialize OpenAI
  const API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  // Check for API key and handle demo mode
  if (!API_KEY || API_KEY.trim() === '') {
    console.log("No OpenAI API key found in environment variables");
    return { response: getDemoResponse(), demo: true };
  }
  
  console.log("Using OpenAI API key:", API_KEY.substring(0, 5) + "...");
  
  // Initialize OpenAI client
  const openaiClient = new OpenAI({
    apiKey: API_KEY,
  });
  
  // If userId is provided, store message and fetch conversation
  let recentConversation = [];
  let chatMessages = [];
  if (userId) {
    try {
      // Store the new user message in the chat history
      await saveUserMessage(supabase, userId, message);
      
      // Fetch recent conversation
      recentConversation = await fetchRecentConversation(supabase, userId);
      
      // Get memory context using embeddings
      if (recentConversation.length > 0) {
        userMemoryContext = await fetchMemoryContext(supabase, userId, openaiClient, recentConversation);
      }
      
      // Save the full conversation history for context
      chatMessages = [...recentConversation];
    } catch (error) {
      console.error("Database error:", error);
    }
  }
  
  // Prepare the chat history for OpenAI
  const chatHistory = recentConversation.length > 0 
    ? recentConversation 
    : conversationHistory;

  // Create system prompt with user profile and memory context
  const systemPrompt = prepareSystemPrompt(userMemoryContext, userProfile);

  // Generate AI response using OpenAI
  const aiResponse = await generateAIResponse(
    openaiClient, 
    systemPrompt, 
    chatHistory, 
    message
  );

  // If userId is provided, save the assistant's response
  if (userId) {
    try {
      await saveAssistantResponse(supabase, userId, aiResponse, 'chat');
      
      // Update chat messages with the new response for memory storage
      chatMessages.push({ role: 'assistant', content: aiResponse });
      
      // Store conversation memory with embedding
      if (chatMessages.length >= 3) {
        try {
          await storeConversationMemory(supabase, userId, openaiClient, chatMessages);
        } catch (memoryError) {
          console.error("Error storing conversation memory:", memoryError);
        }
      }
      
      // Check if we should generate a recommendation
      const shouldRecommend = shouldGenerateRecommendation(recentConversation);
      
      // If we should generate a recommendation and we have streak data
      if (shouldRecommend && userStreakActivity && userStreakActivity.length > 0) {
        try {
          // Generate a recommendation using OpenAI
          const recommendationText = await generateRecommendation(openaiClient, userStreakActivity);
          
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

  return { response: aiResponse };
}

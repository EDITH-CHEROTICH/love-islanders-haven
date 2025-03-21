
// Service for handling AI conversations
import OpenAI from "https://esm.sh/openai@4.24.1";
import { 
  fetchRecentConversation,
  saveUserMessage,
  saveAssistantResponse,
  prepareSystemPrompt,
  shouldGenerateRecommendation
} from '../utils/chatHistory.ts';

import {
  generateAIResponse,
  generateRecommendation,
  getDemoResponse
} from '../utils/aiService.ts';

import {
  storeConversationMemory
} from '../utils/userContext.ts';

import {
  fetchMemoryContext
} from '../services/userDataService.ts';

// Process chat messages and generate AI responses
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

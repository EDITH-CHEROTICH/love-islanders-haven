
// Service for handling AI conversations
import { 
  fetchRecentConversation,
  saveUserMessage,
  saveAssistantResponse,
  shouldGenerateRecommendation,
  prepareSystemPrompt
} from '../utils/chatHistory.ts';

import { getDemoResponse } from '../utils/aiService.ts';

import {
  storeConversationMemory
} from '../utils/userContext.ts';

import OpenAI from "https://esm.sh/openai@4.24.1";

// Process chat messages with n8n or fallback to direct OpenAI
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
  try {
    // Get the n8n webhook URL from environment variables
    const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
    
    // If userId is provided, store message and fetch conversation
    let recentConversation = [];
    let chatMessages = [];
    
    // Try to fetch user email if userId is provided and email wasn't passed
    if (userId && !userEmail) {
      try {
        // Store the new user message in the chat history
        await saveUserMessage(supabase, userId, message);
        
        // Fetch recent conversation
        recentConversation = await fetchRecentConversation(supabase, userId);
        
        // Save the full conversation history for context
        chatMessages = [...recentConversation];
        
        // Try to fetch user email
        if (supabase) {
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
    } else if (userEmail) {
      console.log(`Using provided email for user ${userId || 'anonymous'}: ${userEmail}`);
    }
    
    // Prepare the chat history for processing
    const chatHistory = recentConversation.length > 0 
      ? recentConversation 
      : conversationHistory;
    
    // First, try to use n8n webhook if available
    if (N8N_WEBHOOK_URL && N8N_WEBHOOK_URL.trim() !== '') {
      try {
        console.log("Using n8n webhook URL:", N8N_WEBHOOK_URL.substring(0, 15) + "...");
        
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
        
        // Call n8n webhook with message and context
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        // Check for non-200 responses
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'No error text available');
          console.error(`n8n webhook returned status: ${response.status}`, errorText);
          throw new Error(`n8n webhook returned status: ${response.status}`);
        }
        
        // Parse the result
        const result = await response.json();
        
        // Process the response
        const aiResponse = result.response || 
                          (typeof result === 'string' ? result : 
                          "Sorry, I couldn't generate a response at this time.");
        
        // If userId is provided, save the assistant's response
        if (userId) {
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
        }
        
        return { response: aiResponse };
      } catch (n8nError) {
        // Log the error and fall back to direct OpenAI
        console.error("Error with n8n webhook, falling back to direct OpenAI:", n8nError);
      }
    }
    
    // If n8n webhook is not available or failed, use OpenAI directly
    console.log("No n8n webhook available or it failed, using OpenAI directly");
    
    // Get OpenAI API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key not found, returning demo response");
      return { response: getDemoResponse(false), demo: true };
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });
    
    // Prepare system prompt
    const systemPrompt = prepareSystemPrompt(userMemoryContext, userProfile);
    
    // Prepare messages array for OpenAI
    const messages = [];
    
    // Add system prompt
    messages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Add conversation history
    if (chatHistory && chatHistory.length > 0) {
      messages.push(...chatHistory);
    }
    
    // Add the new message
    messages.push({
      role: 'user',
      content: message
    });
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.8,
      max_tokens: 800,
    });
    
    // Extract the response
    const aiResponse = completion.choices[0].message.content;
    
    // Save response if userId is available
    if (userId) {
      await saveAssistantResponse(supabase, userId, aiResponse, 'chat');
      
      // Update chat messages with the new response for memory storage
      chatMessages.push({ role: 'assistant', content: aiResponse });
      
      // Store conversation memory
      if (chatMessages.length >= 3) {
        try {
          await storeConversationMemory(supabase, userId, openai, chatMessages);
        } catch (memoryError) {
          console.error("Error storing conversation memory:", memoryError);
        }
      }
    }
    
    return { response: aiResponse };
  } catch (error) {
    console.error("Error in AI conversation processing:", error);
    return { 
      response: `I'm having trouble connecting to my brain right now. The specific error was: ${error.message}. Please try again in a moment.`, 
      error: true 
    };
  }
}

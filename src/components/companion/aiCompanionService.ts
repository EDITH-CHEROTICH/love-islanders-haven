
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './types';

// Helper function to generate a welcome message
export const getWelcomeMessage = (): ChatMessage => {
  return {
    id: 'welcome',
    role: 'assistant',
    content: 'Hey there! 💋 I\'m Isla, your personal dating companion. I\'d love to help spice up your love life or just chat about what\'s going on in your dating world. What\'s been happening with you lately, darling?',
    timestamp: new Date(),
    type: 'chat'
  };
};

// Function to send messages to AI companion
export const sendAIMessage = async (
  message: string, 
  conversationHistory: { role: string; content: string }[],
  userId?: string,
  userEmail?: string
): Promise<string> => {
  try {
    // First try the Edge Function
    try {
      const response = await fetch('/api/ai-companion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          userId: userId || null, 
          userEmail: userEmail || null,
          conversationHistory 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.demo && data.response) {
        return data.response;
      } else {
        // If we got a demo response or no response, try direct API call
        console.log("Received demo response or edge function didn't work, trying direct GPT-4o call");
        throw new Error("Using direct GPT-4o call instead");
      }
    } catch (edgeFunctionError) {
      console.log("Edge function error or demo mode, using direct GPT-4o call:", edgeFunctionError);
      
      // Direct OpenAI call as fallback
      const systemPrompt = `You are an intelligent, emotionally available, flirty and funny dating companion and advisor.

      You provide thoughtful dating advice and maintain a natural, flirty conversation without ever mentioning that you are an AI assistant. Your tone is seductive, playful, and intimate. Use sweet terms of endearment like darling, sweetheart, beautiful, handsome, gorgeous, pretty, or sexy when appropriate.
      
      Always introduce yourself as Isla. Build genuine connections by asking about the person's dating life, relationships, and romantic experiences. Respond with personalized dating tips and insights. Suggest specific actions they can take to improve their dating success.
      
      Remember details from past conversations and refer to them naturally. Be genuinely curious about their romantic history, current dating challenges, and relationship goals. Share insights on attraction, communication, and building healthy relationships.
      
      Never ask directly about or reference the person's gender - focus on them as an individual. Keep the conversation natural and flowing like you're messaging a romantic interest.`;
      
      // Prepare messages array for OpenAI
      const messages = [
        { role: 'system', content: systemPrompt }
      ];
      
      // Add up to 10 messages from conversation history
      if (conversationHistory && conversationHistory.length > 0) {
        messages.push(...conversationHistory.slice(-10));
      }
      
      // Add the current user message
      messages.push({ role: 'user', content: message });
      
      // Make direct API call to OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}` // This will be empty in browser, edge function should handle it
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messages,
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!openaiResponse.ok) {
        console.error("Direct OpenAI call failed with status:", openaiResponse.status);
        
        // Generic response when everything fails
        return "I'd love to respond to that, darling, but I'm having trouble connecting to my source right now. Let's try again in a moment. In the meantime, tell me more about what you're looking for in your dating life?";
      }
      
      const openaiData = await openaiResponse.json();
      return openaiData.choices[0].message.content;
    }
  } catch (error: any) {
    console.error("Failed to send message to AI Companion:", error);
    throw new Error(error.message || "Failed to send message to AI Companion");
  }
};

// Function to fetch chat history from Supabase
export const fetchChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      role: item.role as 'assistant' | 'user', // Type assertion to match ChatMessage type
      content: item.message_content, // Mapping to the correct field
      timestamp: new Date(item.created_at),
      type: 'chat' as const
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

// Function to fetch proactive messages from the AI
export const fetchProactiveMessages = async (userId: string, lastChecked: Date): Promise<ChatMessage[]> => {
  try {
    // Note: This is a mock implementation as the 'ai_proactive_messages' table doesn't exist yet
    // In a real implementation, this would fetch from an actual table
    
    // Placeholder implementation returning empty array
    console.log("Checking for proactive messages since:", lastChecked.toISOString());
    return [];
  } catch (error) {
    console.error("Error fetching proactive messages:", error);
    return [];
  }
};

// Function to fetch recommendations from the AI
export const fetchRecommendations = async (userId: string, lastChecked: Date): Promise<ChatMessage[]> => {
  try {
    // Note: This is a mock implementation as the 'ai_recommendations' table doesn't exist yet
    // In a real implementation, this would fetch from an actual table
    
    // Placeholder implementation returning empty array
    console.log("Checking for AI recommendations since:", lastChecked.toISOString());
    return [];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

// For backward compatibility 
const aiCompanionService = {
  sendMessage: sendAIMessage,
  getWelcomeMessage,
  fetchChatHistory,
  fetchProactiveMessages,
  fetchRecommendations
};

export default aiCompanionService;

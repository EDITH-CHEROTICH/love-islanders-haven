
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
      console.log("Calling AI companion edge function with GPT-4o integration");
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
      console.log("Edge function error or demo mode, attempting fallback:", edgeFunctionError);
      
      // Fallback message if everything fails
      return "I'd love to respond to that, darling, but I'm having trouble connecting to my advanced AI capabilities right now. Let's try again in a moment, or check that the OPENAI_API_KEY is properly set up in Supabase Edge Functions.";
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
    console.log("Checking for GPT-4o powered proactive messages since:", lastChecked.toISOString());
    
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'assistant')
      .eq('message_type', 'proactive')
      .gt('created_at', lastChecked.toISOString())
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching proactive messages:", error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.id,
      role: 'assistant',
      content: item.message_content,
      timestamp: new Date(item.created_at),
      type: 'chat' as const
    }));
  } catch (error) {
    console.error("Error fetching proactive messages:", error);
    return [];
  }
};

// Function to fetch recommendations from the AI
export const fetchRecommendations = async (userId: string, lastChecked: Date): Promise<ChatMessage[]> => {
  try {
    console.log("Checking for GPT-4o powered AI recommendations since:", lastChecked.toISOString());
    
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'assistant')
      .eq('message_type', 'recommendation')
      .gt('created_at', lastChecked.toISOString())
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.id,
      role: 'assistant',
      content: item.message_content,
      timestamp: new Date(item.created_at),
      type: 'recommendation' as const
    }));
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


import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './types';

// Helper function to generate a welcome message
export const getWelcomeMessage = (): ChatMessage => {
  return {
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! 👋 I\'m Isla, your AI dating companion. How can I help with your dating journey today?',
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
    return data.response;
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

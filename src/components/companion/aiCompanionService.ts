
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
    console.log('Sending message to AI companion:', { 
      messageLength: message.length,
      historyItems: conversationHistory.length,
      hasUserId: !!userId,
      hasUserEmail: !!userEmail
    });

    // Determine if we're using the edge function directly or via API route
    const endpoint = '/api/ai-companion';
    console.log(`Using endpoint: ${endpoint}`);

    const response = await fetch(endpoint, {
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
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}. Details: ${errorText}`);
    }

    console.log('Response received from AI companion');
    const data = await response.json();
    
    if (data.demo === true) {
      console.log('AI companion is running in demo mode');
      // Signal to the UI that we're in demo mode
      window.postMessage(JSON.stringify({ type: 'ai-companion-demo-mode' }), '*');
    }
    
    if (data.error) {
      console.error('Error from AI companion:', data.error);
    }
    
    return data.response;
  } catch (error: any) {
    console.error("Failed to send message to AI Companion:", error);
    throw new Error(error.message || "Failed to send message to AI Companion");
  }
};

// Function to fetch chat history from Supabase
export const fetchChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    console.log('Fetching chat history for user:', userId);
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} chat history items`);
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

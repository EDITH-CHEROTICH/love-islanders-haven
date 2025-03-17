
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './types';

export const fetchChatHistory = async (userId: string | undefined) => {
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('ai_chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }

  if (data && data.length > 0) {
    // Convert database records to chat messages
    return data.map((item) => ({
      id: item.id,
      role: item.role as 'user' | 'assistant',
      content: item.message_content,
      timestamp: new Date(item.created_at),
      type: (item.message_type as 'chat' | 'recommendation') || 'chat'
    }));
  }

  return [];
};

export const sendAIMessage = async (
  messageText: string, 
  conversationHistory: Array<{ role: string; content: string }>,
  userId?: string
) => {
  try {
    console.log('Sending message to AI companion:', messageText);
    console.log('With conversation history of length:', conversationHistory.length);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('ai-companion', {
      body: {
        message: messageText,
        conversationHistory,
        userId // Pass the user ID to enable personalization
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      console.error('Error from Supabase function:', error);
      throw new Error(error.message || 'Failed to get response from AI companion');
    }

    if (!data || !data.response) {
      if (data && data.error) {
        console.error('Error from AI service:', data.error);
        throw new Error(data.error);
      }
      throw new Error('Invalid response from AI companion');
    }

    return data.response;
  } catch (error) {
    console.error('Error in sendAIMessage:', error);
    throw error;
  }
};

export const fetchRecommendations = async (userId: string, timestamp: Date) => {
  const { data: newMessages, error: fetchError } = await supabase
    .from('ai_chat_history')
    .select('*')
    .eq('user_id', userId)
    .eq('message_type', 'recommendation')
    .gt('created_at', timestamp.toISOString())
    .order('created_at', { ascending: true });

  if (fetchError) {
    console.error('Error fetching recommendations:', fetchError);
    throw fetchError;
  }

  if (newMessages && newMessages.length > 0) {
    // Add recommendations to the chat
    return newMessages.map((item) => ({
      id: item.id,
      role: 'assistant' as const,
      content: item.message_content,
      timestamp: new Date(item.created_at),
      type: 'recommendation' as const
    }));
  }

  return [];
};

export const getWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: "Hi there! I'm Isla, your personal companion. I'm here to chat, listen, and keep you company. I can even give you suggestions for your streak posts based on your activity! How are you feeling today?",
  timestamp: new Date(),
  type: 'chat'
});

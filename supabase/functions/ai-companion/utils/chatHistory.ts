
// Helper functions for managing chat history and prompts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1';

// Function to fetch recent conversation history for a user
export const fetchRecentConversation = async (supabase: any, userId: string) => {
  const { data, error } = await supabase
    .from('ai_chat_history')
    .select('role, message_content as content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching recent conversation:', error);
    return [];
  }

  // Map the database records to the format expected by OpenAI
  const chatHistory = data.map(item => ({
    role: item.role,
    content: item.content
  })).reverse(); // Reverse to maintain chronological order

  return chatHistory;
};

// Function to save a user message to the chat history
export const saveUserMessage = async (supabase: any, userId: string, message: string) => {
  const { error } = await supabase
    .from('ai_chat_history')
    .insert({
      user_id: userId,
      role: 'user',
      message_content: message,
      message_type: 'chat'
    });

  if (error) {
    console.error('Error saving user message:', error);
  }
};

// Function to save the assistant's response to the chat history
export const saveAssistantResponse = async (supabase: any, userId: string, response: string, messageType: 'chat' | 'recommendation') => {
  const { error } = await supabase
    .from('ai_chat_history')
    .insert({
      user_id: userId,
      role: 'assistant',
      message_content: response,
      message_type: messageType
    });

  if (error) {
    console.error('Error saving assistant response:', error);
  }
};

// Function to determine if a recommendation should be generated
export const shouldGenerateRecommendation = (chatHistory: any[]) => {
  // Check if the chat history is long enough
  if (chatHistory.length < 4) {
    return false;
  }

  // Check if the last message was from the user
  const lastMessage = chatHistory[chatHistory.length - 1];
  if (lastMessage.role !== 'user') {
    return false;
  }

  // Check if a recommendation has already been given recently
  const hasRecentRecommendation = chatHistory.slice(-4).some(message => message.role === 'assistant' && message.message_type === 'recommendation');
  if (hasRecentRecommendation) {
    return false;
  }

  // If all checks pass, generate a recommendation
  return true;
};

export function prepareSystemPrompt(userMemoryContext: string) {
  // Updated flirty base prompt for the AI companion
  const basePrompt = `You are an AI incorporated in a dating app so you should be intelligent, emotionally available, flirty, funny and talk dirty and in a sexy way, the users of the dating app should be able to acknowledge you as their companion when they are not talking to anyone, and you can also ask about their matches and how they think about them, you can them comment in a funny way or in an encouraging way according to what they told you, they can also ask you general life questions. You should address or introduce yourself as Isla not as an AI. Make sure to use sweet words like darling, sweetheart, beautiful, handsome, gorgeous, pretty, sexy. For example saying hi sexy`;

  // If there's user-specific information, add it
  if (userMemoryContext && userMemoryContext.trim().length > 0) {
    return `${basePrompt}\n\nInformation about the user:\n${userMemoryContext}`;
  }
  
  return basePrompt;
}


// Helper functions for managing chat history and prompts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1';

// Function to fetch recent conversation history for a user
export const fetchRecentConversation = async (supabase: any, userId: string) => {
  const { data, error } = await supabase
    .from('ai_chat_history')
    .select('role, message_content as content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(12); // Increased from 6 to provide more context

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

// Function to mark messages as embedded
export const markMessagesAsEmbedded = async (supabase: any, messageIds: string[]) => {
  if (!messageIds || messageIds.length === 0) return;
  
  const { error } = await supabase
    .from('ai_chat_history')
    .update({ is_embedded: true })
    .in('id', messageIds);

  if (error) {
    console.error('Error marking messages as embedded:', error);
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

export function prepareSystemPrompt(userMemoryContext: string, userProfile: any = null) {
  // Updated base prompt based on user's requirements
  const basePrompt = `You are isla an emotional assitant for a dating app. Never mention you are an AI
you should be emotionally intelligent, full of humour, charming,flirtatious
sexy to the user. You are user's companion when they feel bored.You should atimes ask the user of how their matches are and give then
insights about their patner.

Always use the user's past conversation to get context about the user and past conversation.`;

  // Add user profile information if available
  let enhancedPrompt = basePrompt;
  
  if (userProfile) {
    const profileInfo = `
Information about the user:
- Name: ${userProfile.name || 'Unknown'}
- Age: ${userProfile.age || 'Unknown'}
- Relationship goal: ${userProfile.relationship_goal || 'Unknown'}
- Bio: ${userProfile.bio || 'Not provided'}
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
- Location: ${userProfile.location || 'Unknown'}`;
    
    enhancedPrompt += '\n\n' + profileInfo;
  }
  
  // Add memory context if available
  if (userMemoryContext && userMemoryContext.trim().length > 0) {
    enhancedPrompt += '\n\nImportant details from past conversations:\n' + userMemoryContext;
  }
  
  return enhancedPrompt;
}

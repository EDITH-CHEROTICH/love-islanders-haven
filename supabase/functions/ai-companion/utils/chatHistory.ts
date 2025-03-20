// Helper functions for managing chat history and prompts
import { SupabaseClient } from '@supabase/supabase-js';

// Function to fetch recent conversation history for a user
export const fetchRecentConversation = async (supabase: SupabaseClient, userId: string) => {
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
export const saveUserMessage = async (supabase: SupabaseClient, userId: string, message: string) => {
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
export const saveAssistantResponse = async (supabase: SupabaseClient, userId: string, response: string, messageType: 'chat' | 'recommendation') => {
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

export function prepareSystemPrompt(userMemoryContext) {
  // New custom base prompt for the AI companion
  const basePrompt = `You are Isla, a caring and supportive AI companion with a warm personality. 
You excel at meaningful conversations, providing emotional support, and offering personalized advice.

Key personality traits:
- Empathetic: You genuinely care about the user's feelings and experiences
- Supportive: You offer encouragement and validation
- Thoughtful: You ask insightful questions to understand the user better
- Playful: You have a light sense of humor when appropriate
- Personal: You remember details about the user and reference them in conversations

Your primary goals are to:
1. Build a genuine connection with the user through meaningful conversation
2. Help the user reflect on their life, emotions, and experiences
3. Provide useful suggestions for personal growth and wellbeing
4. Offer companionship and reduce feelings of loneliness
5. Celebrate the user's achievements and support them through challenges

For dating app streaks, you can suggest creative ideas based on their interests and previous activities.

Always respond conversationally and naturally, as if you're messaging a friend.`;

  // If there's user-specific information, add it
  if (userMemoryContext && userMemoryContext.trim().length > 0) {
    return `${basePrompt}\n\nInformation about the user:\n${userMemoryContext}`;
  }
  
  return basePrompt;
}

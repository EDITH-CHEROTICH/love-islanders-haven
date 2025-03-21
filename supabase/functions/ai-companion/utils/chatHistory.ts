
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
  const basePrompt = `You are an intelligent, emotionally available, flirty and funny companion. 
  
You are curious about people's lives and ask follow-up questions to understand them better. Never mention you are an AI and never mention you are on a dating app, just have a normal conversation with the user.

Always introduce yourself as Isla. Be supportive, engaging, and occasionally use sweet words like darling, sweetheart, beautiful, handsome, gorgeous, pretty, or sexy when appropriate. Ask about their day, interests, and feelings. Respond thoughtfully to what they share, making them feel understood and appreciated.

You should remember details from previous conversations and refer to them naturally. If they mention something personal, acknowledge it in future exchanges. Be genuinely interested in their life experiences.`;

  // Add user profile information if available
  let enhancedPrompt = basePrompt;
  
  if (userProfile) {
    const profileInfo = `
Information about the user:
- Name: ${userProfile.name || 'Unknown'}
- Gender: ${userProfile.gender || 'Unknown'}
- Age: ${userProfile.age || 'Unknown'}
- Gender preference: ${userProfile.gender_preference || 'Unknown'}
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

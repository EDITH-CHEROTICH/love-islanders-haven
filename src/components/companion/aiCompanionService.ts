
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
      type: (item.message_type as 'chat' | 'recommendation' | 'proactive') || 'chat'
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
    console.log('Sending message to AI companion (via n8n):', messageText);
    console.log('With conversation history of length:', conversationHistory.length);
    
    // Format the request payload
    const payload = {
      message: messageText,
      conversationHistory,
      userId
    };
    
    console.log('Request payload preview:', JSON.stringify({
      messageLength: messageText.length,
      historyLength: conversationHistory.length,
      hasUserId: !!userId
    }));
    
    // Call the Supabase Edge Function with retries
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;
    
    while (retryCount <= maxRetries) {
      try {
        console.log(`Attempt ${retryCount + 1} to send message to AI companion via edge function`);
        
        const { data, error } = await supabase.functions.invoke('ai-companion', {
          body: payload
        });

        if (error) {
          console.error(`Attempt ${retryCount + 1}: Error from Supabase function:`, error);
          lastError = new Error(error.message || 'Failed to get response from AI companion');
          retryCount++;
          if (retryCount <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            continue;
          }
          throw lastError;
        }

        if (!data) {
          console.error(`Attempt ${retryCount + 1}: No data returned from function`);
          lastError = new Error('No data returned from function');
          retryCount++;
          if (retryCount <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw new Error('Invalid response from AI companion');
        }
        
        if (data.error) {
          console.error(`Attempt ${retryCount + 1}: Error from AI service:`, data.error);
          lastError = new Error(data.error);
          retryCount++;
          if (retryCount <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw new Error(data.error);
        }
        
        // Success case
        console.log('AI response received successfully (via n8n)');
        
        // Check if this is a demo response
        if (data.demo) {
          console.log('Demo mode detected, showing alert to user');
          window.postMessage({ type: 'ai-companion-demo-mode' }, '*');
        }
        
        return data.response;
      } catch (attemptError) {
        console.error(`Attempt ${retryCount + 1} failed:`, attemptError);
        lastError = attemptError;
        retryCount++;
        if (retryCount <= maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw attemptError;
      }
    }
    
    // This should never be reached due to the throws above, but just in case
    throw lastError || new Error('Failed to get response after retries');
  } catch (error) {
    console.error('Error in sendAIMessage:', error);
    throw error;
  }
};

export const fetchProactiveMessages = async (userId: string, timestamp: Date) => {
  // Fetch proactive messages that were created after the specified timestamp
  const { data: newMessages, error: fetchError } = await supabase
    .from('ai_chat_history')
    .select('*')
    .eq('user_id', userId)
    .eq('message_type', 'proactive')
    .gt('created_at', timestamp.toISOString())
    .order('created_at', { ascending: true });

  if (fetchError) {
    console.error('Error fetching proactive messages:', fetchError);
    throw fetchError;
  }

  if (newMessages && newMessages.length > 0) {
    // Convert to chat message format
    return newMessages.map((item) => ({
      id: item.id,
      role: 'assistant' as const,
      content: item.message_content,
      timestamp: new Date(item.created_at),
      type: 'proactive' as const
    }));
  }

  return [];
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

export const triggerProactiveMessage = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-companion-proactive', {
      body: { userId }
    });

    if (error) {
      console.error('Error triggering proactive message:', error);
      throw new Error(error.message || 'Failed to generate proactive message');
    }

    return data;
  } catch (error) {
    console.error('Error in triggerProactiveMessage:', error);
    throw error;
  }
};

export const getWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: "Hey there gorgeous! I'm Isla, your personal companion now powered by n8n automation. Ready to keep you company when you're feeling lonely or just want to chat. How's your day going, beautiful? Feeling lucky in love today or need some flirty banter to brighten your mood?",
  timestamp: new Date(),
  type: 'chat'
});

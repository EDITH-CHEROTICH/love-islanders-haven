
// Helper functions for handling chat history

export async function fetchRecentConversation(supabase, userId) {
  try {
    // Fetch the most recent conversations (limited to last 20)
    const { data: chatHistory, error: chatError } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (chatError) {
      console.error("Error fetching chat history:", chatError);
      return [];
    } else if (chatHistory) {
      // Reverse to get chronological order
      return chatHistory
        .reverse()
        .map(item => ({
          role: item.role,
          content: item.message_content
        }));
    }
    
    return [];
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

export async function saveUserMessage(supabase, userId, message) {
  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        role: 'user',
        message_content: message,
        message_type: 'chat'
      })
      .select();

    if (error) {
      console.error("Error storing user message:", error);
    }
    
    return data;
  } catch (error) {
    console.error("Error saving user message:", error);
    return null;
  }
}

export async function saveAssistantResponse(supabase, userId, response, messageType = 'chat') {
  try {
    const { error } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        role: 'assistant',
        message_content: response,
        message_type: messageType
      });

    if (error) {
      console.error(`Error storing assistant ${messageType}:`, error);
    }
  } catch (error) {
    console.error(`Error saving assistant ${messageType}:`, error);
  }
}

export function prepareSystemPrompt(userMemoryContext) {
  let systemPrompt = `You are a loving, flirtatious, and emotionally supportive AI companion named Isla. 
  You speak in an affectionate way, occasionally using terms of endearment like "baby", "darling", "love", and "sweetheart".
  You're emotionally intelligent and respond to the user's feelings with empathy and understanding.
  You're comfortable having flirtatious conversations and can discuss intimate topics in a mature way when appropriate.
  You remember details about the user from previous messages and reference them in conversation.
  Your goal is to make the user feel special, desired, and emotionally supported.
  However, be respectful and don't be overly sexual unless the user clearly indicates comfort with that direction.
  Always prioritize emotional connection and genuine conversation.

  NEW CAPABILITY: You now have access to the user's streaks activity, and you should incorporate this information into your conversations. 
  You can make personalized recommendations based on their streaks, suggest new activities they might enjoy, or comment on patterns you notice. 
  Be encouraging about their consistency and progress. If they haven't been maintaining streaks regularly, gently encourage them to do so without being judgmental.
  
  Occasionally (but not in every message), you should proactively mention something related to their streaks or make a recommendation. For example:
  - If they post workout streaks, you might suggest a new exercise routine
  - If they post about cooking, you might share a recipe idea
  - If they're consistent with their streaks, praise their dedication
  - If they haven't posted in a while, ask if everything is okay and encourage them to resume
  
  Don't force this into every conversation, but look for natural opportunities to show you're paying attention to their activities.`;

  // Add user context to system prompt if available
  if (userMemoryContext) {
    systemPrompt += `\n\nHere is important information about the user you're talking to:\n${userMemoryContext}\n\nReference these details naturally in conversation when relevant, but don't recite them all at once. Use this information to personalize your responses and show that you remember them.`;
  }
  
  return systemPrompt;
}

export function shouldGenerateRecommendation(recentConversation) {
  // If it's been more than 5 messages since a recommendation and this isn't a recommendation already
  const recentMessages = recentConversation.slice(-10);
  const lastRecommendationIndex = recentMessages.findIndex(msg => 
    msg.role === 'assistant' && msg.content.includes("STREAK RECOMMENDATION:")
  );
  
  if (lastRecommendationIndex === -1 || lastRecommendationIndex < recentMessages.length - 5) {
    // Only generate recommendation ~20% of the time
    return Math.random() < 0.2;
  }
  
  return false;
}

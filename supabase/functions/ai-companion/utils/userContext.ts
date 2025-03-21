
// Helper for managing user memory and conversation context
import OpenAI from "https://esm.sh/openai@4.24.1";

// Generate embeddings for text using OpenAI
export async function generateEmbedding(openaiClient: any, text: string) {
  try {
    const embeddingResponse = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    
    return embeddingResponse.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// Summarize a conversation using OpenAI
export async function summarizeConversation(openaiClient: any, messages: any[]) {
  try {
    // Format the conversation for summarization
    const conversationText = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize the key points and personal details from this conversation in a concise way. Focus on facts about the user, their preferences, important life events, and memorable moments. The summary will be used to provide context for future conversations."
        },
        {
          role: "user",
          content: conversationText
        }
      ],
      max_tokens: 300
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing conversation:", error);
    return "";
  }
}

// Store conversation memory with vector embedding
export async function storeConversationMemory(supabase: any, userId: string, openaiClient: any, messages: any[]) {
  try {
    if (messages.length < 3) return; // Need at least a few messages to summarize
    
    // Summarize the conversation
    const summary = await summarizeConversation(openaiClient, messages);
    if (!summary) return;
    
    // Generate embedding for the summary
    const embedding = await generateEmbedding(openaiClient, summary);
    
    // Store in the database
    const { error } = await supabase
      .from('ai_conversation_memories')
      .insert({
        user_id: userId,
        conversation_summary: summary,
        embedding: embedding
      });
      
    if (error) {
      console.error("Error storing conversation memory:", error);
    }
  } catch (error) {
    console.error("Error in storeConversationMemory:", error);
  }
}

// Retrieve relevant context based on the latest messages
export async function retrieveRelevantMemories(supabase: any, userId: string, openaiClient: any, recentMessages: any[]) {
  try {
    // Create a query from recent messages
    const queryText = recentMessages
      .map(msg => msg.content)
      .join(" ");
      
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(openaiClient, queryText);
    
    // Query for similar memories
    const { data, error } = await supabase.rpc(
      'find_similar_conversations',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 5
      }
    );
    
    if (error) {
      console.error("Error retrieving memories:", error);
      return "";
    }
    
    if (!data || data.length === 0) {
      return "";
    }
    
    // Combine relevant memories
    return data
      .map(item => item.conversation_summary)
      .join("\n\n");
      
  } catch (error) {
    console.error("Error in retrieveRelevantMemories:", error);
    return "";
  }
}

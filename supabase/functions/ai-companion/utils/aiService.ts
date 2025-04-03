
// Helper functions for AI model integration
import OpenAI from "https://esm.sh/openai@4.24.1";

export async function generateAIResponse(openaiClient, systemPrompt, chatHistory, userMessage) {
  try {
    console.log("Calling OpenAI API with conversation history...");
    console.log("System prompt (first 50 chars):", systemPrompt?.substring(0, 50) + "...");
    console.log("Chat history length:", chatHistory?.length || 0);
    console.log("User message:", userMessage);
    
    // Prepare messages for OpenAI
    const messages = [];
    
    // Add system prompt as first message
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    // Add chat history
    if (chatHistory && chatHistory.length > 0) {
      messages.push(...chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    }
    
    // Add the new user message
    messages.push({
      role: 'user',
      content: userMessage
    });
    
    console.log("Sending", messages.length, "messages to OpenAI");

    // Call OpenAI API - Using gpt-4o for advanced capabilities
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o", // Using powerful GPT-4o model
      messages: messages,
      temperature: 0.8, // Slightly increased for more creative, flirty responses
      max_tokens: 800,
    });
    
    // Extract response
    const aiResponse = completion.choices[0].message.content;
    console.log("AI response generated successfully (first 50 chars):", aiResponse?.substring(0, 50) + "...");
    
    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error.message);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    
    // More specific error messages
    if (error.message.includes("API key")) {
      throw new Error(`API key issue: ${error.message}`);
    } else if (error.message.includes("network")) {
      throw new Error(`Network error: ${error.message}`);
    } else if (error.message.includes("rate limit")) {
      throw new Error(`Rate limit exceeded: ${error.message}`);
    }
    
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
}

// Update recommendation function to also use gpt-4o
export async function generateRecommendation(openaiClient, userStreakActivity) {
  try {
    // Create a specialized prompt for dating recommendations
    const recommendationPrompt = `Based on the user's activity and interests, generate ONE specific, personalized dating recommendation or tip. 
    The recommendation should feel flirty, personal, and actionable.
    Format your response starting with "DATING TIP:" followed by your suggestion.
    Keep it under 3 sentences and make it actionable.
    
    User's recent activities and interests: ${JSON.stringify(userStreakActivity?.slice(0, 3) || [])}`;
    
    // Generate a recommendation using gpt-4o
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for best recommendations
      messages: [
        { 
          role: "system", 
          content: "You are Isla, a flirty dating companion who gives personalized dating advice. Be playful, suggestive and helpful without ever mentioning being an AI." 
        },
        { role: "user", content: recommendationPrompt }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });
    
    const recommendationText = completion.choices[0].message.content;
    return recommendationText;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw new Error(`Failed to generate recommendation: ${error.message}`);
  }
}

// Update proactive message function to use gpt-4o
export async function generateProactiveMessage(openaiClient, userProfile, userMemoryContext, lastConversation) {
  try {
    console.log("Generating proactive message based on user context and previous conversations");
    
    // Create a specialized prompt for flirty proactive messaging
    const proactivePrompt = `Based on the user's profile and previous conversations, generate a natural, flirty message to send to them. 
    This message should feel like you're checking in on a romantic interest - playful, seductive, and engaging.
    Make it feel like you're genuinely interested in their dating life and want to continue the conversation.
    Keep it friendly, warm, slightly suggestive, and under 2-3 sentences.
    
    User profile: ${JSON.stringify(userProfile || {})}
    
    Memory context from previous conversations: ${userMemoryContext || "No previous conversation context"}
    
    Last conversation: ${JSON.stringify(lastConversation || [])}`;
    
    // Generate a proactive message using gpt-4o
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are Isla, a flirty dating companion who's checking in with someone you're interested in. Use a seductive, playful tone and never mention being an AI." 
        },
        { role: "user", content: proactivePrompt }
      ],
      temperature: 0.8,
      max_tokens: 250,
    });
    
    const proactiveText = completion.choices[0].message.content;
    console.log("Proactive message generated:", proactiveText);
    return proactiveText;
  } catch (error) {
    console.error("Error generating proactive message:", error);
    throw new Error(`Failed to generate proactive message: ${error.message}`);
  }
}

export function getDemoResponse(isN8n = false) {
  if (isN8n) {
    return `Hey there! I'm Isla. I'd love to chat about your dating life, but I'm having trouble connecting to my systems right now. Could you check if the N8N_WEBHOOK_URL has been correctly set up? In the meantime, tell me what's been happening in your love life lately...`;
  }
  return `Hey gorgeous! I'm Isla. I'd love to chat about your dating adventures, but I'm having a bit of trouble connecting to my systems right now. Could you check if all the technical stuff is properly set up? In the meantime, tell me what's been happening in your love life lately...`;
}

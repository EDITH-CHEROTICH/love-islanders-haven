
// Helper functions for AI model interaction
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

    // Call OpenAI API - Now using gpt-4o
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o", // Upgraded to gpt-4o for better capabilities
      messages: messages,
      temperature: 0.7,
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

export async function generateRecommendation(openaiClient, userStreakActivity) {
  try {
    // Create a specialized prompt for streak recommendations
    const recommendationPrompt = `Based on the user's streak activity and interests, generate ONE specific, personalized recommendation for their next streak post. 
    The recommendation should be relevant to their interests and previous streak content.
    Format your response starting with "STREAK RECOMMENDATION:" followed by your suggestion.
    Keep it under 3 sentences and make it actionable.
    
    User's recent streaks and interests: ${JSON.stringify(userStreakActivity.slice(0, 3))}`;
    
    // Generate a recommendation using gpt-4o
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o", // Upgraded to gpt-4o for better recommendations
      messages: [
        { role: "user", content: recommendationPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });
    
    const recommendationText = completion.choices[0].message.content;
    return recommendationText;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw new Error(`Failed to generate recommendation: ${error.message}`);
  }
}

export function getDemoResponse() {
  return `Hello there! I'm Isla, your AI companion. I'm having trouble connecting to my servers right now. Please check if the OpenAI API key has been correctly set in the Supabase Edge Function settings. How are you feeling today?`;
}

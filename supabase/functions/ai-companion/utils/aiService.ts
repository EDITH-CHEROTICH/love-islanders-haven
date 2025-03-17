
// Helper functions for AI model interaction

export async function generateAIResponse(genAIClient, MODEL_NAME, systemPrompt, chatHistory, userMessage) {
  try {
    console.log("Calling Gemini API with conversation history...");
    console.log("System prompt:", systemPrompt.substring(0, 50) + "...");
    console.log("Chat history length:", chatHistory.length);
    console.log("User message:", userMessage);
    
    // Get the model
    const model = genAIClient.getGenerativeModel({ model: MODEL_NAME });

    // Format chat history for Gemini
    // Note: Gemini expects 'user' and 'model' roles
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    // System prompts need to be sent as user messages at the beginning
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    // Add system prompt as first message if not present in history
    let result;
    if (chatHistory.length === 0) {
      // First, send the system prompt
      await chat.sendMessage(systemPrompt);
      
      // Then send the actual user message
      result = await chat.sendMessage(userMessage);
    } else {
      // If we already have history, just send the new message
      result = await chat.sendMessage(userMessage);
    }
    
    // Extract the response text
    const aiResponse = result.response.text();
    console.log("AI response generated successfully:", aiResponse.substring(0, 50) + "...");
    
    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error.message);
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

export async function generateRecommendation(model, userStreakActivity) {
  try {
    // Create a specialized prompt for streak recommendations
    const recommendationPrompt = `Based on the user's streak activity and interests, generate ONE specific, personalized recommendation for their next streak post. 
    The recommendation should be relevant to their interests and previous streak content.
    Format your response starting with "STREAK RECOMMENDATION:" followed by your suggestion.
    Keep it under 3 sentences and make it actionable.
    
    User's recent streaks and interests: ${JSON.stringify(userStreakActivity.slice(0, 3))}`;
    
    // Generate a recommendation
    const recommendationResult = await model.generateContent(recommendationPrompt);
    const recommendationText = recommendationResult.response.text();
    
    return recommendationText;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw new Error(`Failed to generate recommendation: ${error.message}`);
  }
}

export function getDemoResponse() {
  return `Hello there! I'm Isla, your AI companion. I'm having trouble connecting to my servers right now. Please check if the Google AI API key has been correctly set in the Supabase Edge Function settings. How are you feeling today?`;
}


// Helper functions for AI model interaction

export async function generateAIResponse(genAIClient, MODEL_NAME, systemPrompt, chatHistory, userMessage) {
  try {
    console.log("Calling Gemini API with conversation history...");
    
    // Get the model
    const model = genAIClient.getGenerativeModel({ model: MODEL_NAME });

    // Format the history for Gemini API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add the system prompt at the beginning if not already present
    if (formattedHistory.length === 0 || formattedHistory[0].parts[0].text !== systemPrompt) {
      formattedHistory.unshift({
        role: 'user',
        parts: [{ text: `${systemPrompt}` }]
      });
    }

    console.log("Starting chat session with formatted history...");
    
    // Start the chat session with the formatted history
    const chatSession = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 800,
      },
    });

    console.log("Sending message to chat session...");
    const result = await chatSession.sendMessage(userMessage);
    const aiResponse = result.response.text();

    console.log("AI response generated successfully");
    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
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

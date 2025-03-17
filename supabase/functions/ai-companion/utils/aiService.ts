
// Helper functions for AI model interaction

export async function generateAIResponse(genAIClient, MODEL_NAME, systemPrompt, chatHistory, userMessage) {
  try {
    console.log("Calling Gemini API with conversation history...");
    
    // Get the model
    const model = genAIClient.getGenerativeModel({ model: MODEL_NAME });

    // Add the system prompt at the beginning
    const historyWithSystemPrompt = [
      { role: "system", content: systemPrompt },
      ...chatHistory
    ];
    
    // Call Gemini API
    const chatSession = model.startChat({
      history: historyWithSystemPrompt,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 800,
      },
    });

    const result = await chatSession.sendMessage(userMessage);
    const aiResponse = result.response.text();

    console.log("AI response generated successfully");
    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
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
  return `Hello there! I'm Isla, your AI companion (running in demo mode). I'd love to chat more authentically, but I'm currently in demonstration mode. In a real application, you would add your Google AI API key to get my full personality and capabilities. How are you feeling today?`;
}

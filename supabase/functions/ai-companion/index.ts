
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Import utility functions
import { handleCorsPreflightRequest, validateRequestBody } from './utils/middleware.ts';
import { createSuccessResponse, createErrorResponse } from './utils/responseHandler.ts';
import { initializeSupabaseClient, fetchUserContextData } from './services/userDataService.ts';
import { processConversationWithN8n } from './services/aiConversationService.ts';
import { corsHeaders } from './utils/constants.ts';

// Initialize Supabase client
const supabase = initializeSupabaseClient();

serve(async (req) => {
  try {
    console.log("Received request to AI companion");
    
    // Debug: Log request method and headers
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Handle CORS preflight requests
    const corsResponse = handleCorsPreflightRequest(req);
    if (corsResponse) {
      console.log("Returning CORS preflight response");
      return corsResponse;
    }
    
    // Validate and parse the request body
    const validation = await validateRequestBody(req);
    if (!validation.isValid) {
      console.error("Request validation failed:", validation.errorResponse.status);
      return validation.errorResponse;
    }
    
    const { message, conversationHistory, userId, userEmail } = validation.data;
    
    console.log("Request params:", { 
      message: message ? message.substring(0, 20) + "..." : "Missing", 
      historyLength: conversationHistory.length,
      userId: userId ? userId.substring(0, 8) + "..." : "Missing",
      userEmail: userEmail ? userEmail.substring(0, 5) + "..." : "Missing"
    });

    // Check if OpenAI API key is configured
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      console.error("OpenAI API key is not configured");
      return createErrorResponse(new Error("OpenAI API key is not configured. Please add it to the Edge Function secrets."), 500);
    }
    
    // Fetch user context data if userId is provided
    const {
      userMemoryContext,
      userProfile,
      userStreakActivity
    } = await fetchUserContextData(supabase, userId);
    
    // Debug: Log the context data
    console.log("Context data retrieved:", {
      hasMemoryContext: !!userMemoryContext,
      hasProfile: !!userProfile,
      streakActivityCount: userStreakActivity?.length || 0
    });
    
    // Process the conversation and generate an AI response using n8n
    const result = await processConversationWithN8n(
      message,
      conversationHistory,
      userId,
      supabase,
      userMemoryContext,
      userStreakActivity,
      userProfile,
      userEmail
    );

    console.log("Successfully generated AI response");
    return createSuccessResponse(result);
  } catch (error) {
    console.error("Error in AI companion edge function:", error);
    return createErrorResponse(error);
  }
});

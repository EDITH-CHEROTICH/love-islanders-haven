
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
    
    // Handle CORS preflight requests
    const corsResponse = handleCorsPreflightRequest(req);
    if (corsResponse) return corsResponse;
    
    // Validate and parse the request body
    const validation = await validateRequestBody(req);
    if (!validation.isValid) {
      return validation.errorResponse;
    }
    
    const { message, conversationHistory, userId, userEmail } = validation.data;
    
    console.log("Request params:", { 
      message: message ? "Present" : "Missing", 
      historyLength: conversationHistory.length,
      userId: userId ? "Present" : "Missing",
      userEmail: userEmail ? userEmail : "Missing"
    });

    // Fetch user context data if userId is provided
    const {
      userMemoryContext,
      userProfile,
      userStreakActivity
    } = await fetchUserContextData(supabase, userId);
    
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

    console.log("Successfully generated AI response via n8n");
    return createSuccessResponse(result);
  } catch (error) {
    return createErrorResponse(error);
  }
});

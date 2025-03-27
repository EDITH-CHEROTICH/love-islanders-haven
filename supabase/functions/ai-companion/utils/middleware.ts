
import { corsHeaders } from './constants.ts';

// Handle CORS preflight requests
export function handleCorsPreflightRequest(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  return null;
}

// Validate request body
export async function validateRequestBody(req: Request) {
  try {
    if (req.method !== 'POST') {
      return {
        isValid: false,
        errorResponse: new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      };
    }

    // Parse request body
    const requestBody = await req.json();
    
    if (!requestBody.message) {
      return {
        isValid: false,
        errorResponse: new Response(
          JSON.stringify({ error: 'Missing message in request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      };
    }

    // Extract parameters with defaults
    const message = requestBody.message;
    const conversationHistory = requestBody.conversationHistory || [];
    const userId = requestBody.userId || undefined;
    const userEmail = requestBody.userEmail || undefined;
    
    // Log successful validation
    console.log("Request body validated successfully");
    console.log("Message preview:", message.substring(0, 20) + "...");
    console.log("Conversation history items:", conversationHistory.length);
    console.log("User identification:", userId ? `ID: ${userId.substring(0, 8)}...` : 'Anonymous');
    
    return {
      isValid: true,
      data: { message, conversationHistory, userId, userEmail }
    };
  } catch (error) {
    console.error("Error validating request body:", error);
    
    return {
      isValid: false,
      errorResponse: new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }
}

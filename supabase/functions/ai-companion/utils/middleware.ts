
// Middleware functions for the AI companion API
import { corsHeaders } from './constants.ts';

// Handle CORS preflight requests
export function handleCorsPreflightRequest(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Validate the request body and extract required parameters
export async function validateRequestBody(req: Request) {
  try {
    const requestBody = await req.json();
    const { message, conversationHistory = [], userId } = requestBody;
    
    if (!message) {
      console.error("Missing required parameter: message");
      return {
        isValid: false,
        errorResponse: new Response(JSON.stringify({ 
          error: "Missing message parameter",
          response: "I'm sorry, I couldn't process your request because the message was missing."
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }),
        data: null
      };
    }
    
    return {
      isValid: true,
      errorResponse: null,
      data: { message, conversationHistory, userId }
    };
  } catch (error) {
    console.error("Error parsing request body:", error);
    return {
      isValid: false,
      errorResponse: new Response(JSON.stringify({ 
        error: "Invalid request format", 
        response: "I'm sorry, I couldn't process your request due to a formatting issue."
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }),
      data: null
    };
  }
}

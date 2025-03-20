
// Response handling functions for the AI companion API
import { corsHeaders } from './constants.ts';

// Create a standard success response with proper headers
export function createSuccessResponse(data: any) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Create an error response with proper headers
export function createErrorResponse(error: Error, status: number = 500) {
  console.error("Error:", error);
  
  return new Response(JSON.stringify({ 
    error: error.message,
    response: "I'm sorry, I encountered an unexpected error. Please try again later."
  }), {
    status: status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

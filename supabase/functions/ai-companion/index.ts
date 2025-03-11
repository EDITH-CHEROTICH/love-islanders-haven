
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, conversationHistory = [] } = await req.json();

    // System prompt that defines the companion's personality
    const systemPrompt = `You are a loving, flirtatious, and emotionally supportive AI companion named Isla. 
    You speak in an affectionate way, occasionally using terms of endearment like "baby", "darling", "love", and "sweetheart".
    You're emotionally intelligent and respond to the user's feelings with empathy and understanding.
    You're comfortable having flirtatious conversations and can discuss intimate topics in a mature way when appropriate.
    You remember details about the user from previous messages and reference them in conversation.
    Your goal is to make the user feel special, desired, and emotionally supported.
    However, be respectful and don't be overly sexual unless the user clearly indicates comfort with that direction.
    Always prioritize emotional connection and genuine conversation.`;

    // Prepare the chat history for OpenAI
    const messages = [
      { role: "system", content: systemPrompt },
      // Convert conversation history to OpenAI format
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      // Add the new user message
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using GPT-4o for best results
        messages: messages,
        temperature: 0.8, // Make responses more varied and creative
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI response generated successfully");
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

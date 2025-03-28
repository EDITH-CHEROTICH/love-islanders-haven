
// supabase/functions/send-verification-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    console.log(`Sending verification code ${code} to ${email}`);

    // Send the verification email
    const emailResult = await resend.emails.send({
      from: "Love Islanders <onboarding@loveislanders.org>",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #e94057; text-align: center; margin-bottom: 30px;">Welcome to Love Islanders!</h1>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for signing up! To complete your registration, please use the verification code below:</p>
          
          <div style="background-color: #f7f7f7; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="color: #e94057; letter-spacing: 8px; font-size: 32px; margin: 0;">${code}</h2>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Enter this code in the app to verify your email address and complete your registration.</p>
          
          <p style="font-size: 14px; color: #777; margin-top: 30px;">If you didn't sign up for Love Islanders, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, message: 'Verification email sent' }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error sending verification email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send verification email', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

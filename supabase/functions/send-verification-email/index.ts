
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  code: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerificationEmailRequest = await req.json();

    console.log(`Sending verification code ${code} to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Verification <onboarding@resend.dev>",
      to: [email],
      subject: "Your Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e11d48; text-align: center; margin-top: 40px;">Your Verification Code</h1>
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center;">
            <p style="margin-bottom: 20px; font-size: 16px;">Use the following code to verify your email address:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827; margin: 20px 0;">
              ${code}
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
            If you didn't request this code, you can ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

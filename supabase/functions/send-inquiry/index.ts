import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Input validation constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_WOOD_ITEM_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

interface InquiryRequest {
  customer_name: string;
  customer_email: string;
  wood_item: string;
  message: string;
}

// Sanitize text to prevent XSS in emails
function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Validate and sanitize input
function validateInput(data: unknown): { valid: true; data: InquiryRequest } | { valid: false; error: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request format" };
  }

  const { customer_name, customer_email, wood_item, message } = data as Record<string, unknown>;

  // Validate customer_name
  if (typeof customer_name !== "string" || customer_name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  if (customer_name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Name must be less than ${MAX_NAME_LENGTH} characters` };
  }

  // Validate customer_email
  if (typeof customer_email !== "string" || customer_email.trim().length === 0) {
    return { valid: false, error: "Email is required" };
  }
  if (customer_email.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` };
  }
  if (!EMAIL_REGEX.test(customer_email.trim())) {
    return { valid: false, error: "Invalid email format" };
  }

  // Validate wood_item
  if (typeof wood_item !== "string" || wood_item.trim().length === 0) {
    return { valid: false, error: "Wood item is required" };
  }
  if (wood_item.length > MAX_WOOD_ITEM_LENGTH) {
    return { valid: false, error: `Wood item must be less than ${MAX_WOOD_ITEM_LENGTH} characters` };
  }

  // Validate message
  if (typeof message !== "string" || message.trim().length === 0) {
    return { valid: false, error: "Message is required" };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` };
  }

  return {
    valid: true,
    data: {
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      wood_item: wood_item.trim(),
      message: message.trim(),
    },
  };
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email service is currently unavailable" }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Service is currently unavailable" }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate input
    let rawData: unknown;
    try {
      rawData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const validation = validateInput(rawData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { customer_name, customer_email, wood_item, message } = validation.data;

    console.log(`Processing inquiry from ${customer_name} for: ${wood_item}`);

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert inquiry into database
    const { error: dbError } = await supabase.from("wood_inquiries").insert({
      customer_name,
      customer_email,
      wood_item,
      message,
    });

    if (dbError) {
      console.error("Database insert error:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: "Unable to process inquiry. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Inquiry saved to database successfully");

    // Sanitize user input for HTML email
    const safeName = sanitizeText(customer_name);
    const safeEmail = sanitizeText(customer_email);
    const safeWoodItem = sanitizeText(wood_item);
    const safeMessage = sanitizeText(message);

    // Send notification email to business owner
    const notificationEmail = await resend.emails.send({
      from: "Yew & Grain Inquiries <onboarding@resend.dev>",
      to: ["yewNgrain@outlook.com"],
      subject: `🌳 New Inquiry: ${safeWoodItem}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #c4702c, #a65c24); color: #f5f2eb; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-family: Georgia, serif; font-size: 24px; }
            .content { padding: 30px; background: #f5f2eb; }
            .field { margin-bottom: 20px; }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 5px; }
            .value { font-size: 16px; color: #1a1a1a; }
            .message-box { background: white; padding: 20px; border-left: 4px solid #c4702c; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .cta { display: inline-block; background: #c4702c; color: white !important; padding: 12px 24px; text-decoration: none; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Yew & Grain</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">New Customer Inquiry</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Customer Name</div>
                <div class="value">${safeName}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
              </div>
              <div class="field">
                <div class="label">Inquiry About</div>
                <div class="value">${safeWoodItem}</div>
              </div>
              <div class="message-box">
                <div class="label">Message</div>
                <div class="value">${safeMessage.replace(/\n/g, "<br>")}</div>
              </div>
              <a href="mailto:${safeEmail}?subject=Re: Your Yew %26 Grain Inquiry" class="cta">Reply to Customer</a>
            </div>
            <div class="footer">
              <p>This notification was sent from your Yew & Grain website.</p>
              <p>📞 +44 7852 862296</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Notification email sent successfully:", notificationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Inquiry submitted successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error processing inquiry:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Unable to process inquiry. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

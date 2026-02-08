import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InquiryRequest {
  customer_name: string;
  customer_email: string;
  wood_item: string;
  message: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { customer_name, customer_email, wood_item, message }: InquiryRequest = await req.json();

    // Validate required fields
    if (!customer_name || !customer_email || !wood_item || !message) {
      throw new Error("Missing required fields: customer_name, customer_email, wood_item, message");
    }

    console.log(`Processing inquiry from ${customer_name} (${customer_email}) for: ${wood_item}`);

    // Insert inquiry into database
    const { error: dbError } = await supabase.from("wood_inquiries").insert({
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim(),
      wood_item: wood_item.trim(),
      message: message.trim(),
    });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(`Failed to save inquiry: ${dbError.message}`);
    }

    console.log("Inquiry saved to database successfully");

    // Send notification email to business owner
    const notificationEmail = await resend.emails.send({
      from: "Yew & Grain Inquiries <onboarding@resend.dev>",
      to: ["yewNgrain@outlook.com"],
      subject: `🌳 New Inquiry: ${wood_item}`,
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
                <div class="value">${customer_name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${customer_email}">${customer_email}</a></div>
              </div>
              <div class="field">
                <div class="label">Inquiry About</div>
                <div class="value">${wood_item}</div>
              </div>
              <div class="message-box">
                <div class="label">Message</div>
                <div class="value">${message.replace(/\n/g, "<br>")}</div>
              </div>
              <a href="mailto:${customer_email}?subject=Re: Your Yew %26 Grain Inquiry" class="cta">Reply to Customer</a>
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
        message: "Inquiry submitted and notification sent",
        emailId: notificationEmail.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error processing inquiry:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

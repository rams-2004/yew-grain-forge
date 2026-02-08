import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // 15 requests per minute per IP
const MAX_MESSAGES = 50; // Maximum messages in conversation
const MAX_MESSAGE_LENGTH = 2000; // Maximum characters per message
const MAX_TOTAL_CONTENT_LENGTH = 10000; // Maximum total content length

// In-memory rate limiting store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit for an IP
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // Create new window
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetIn: record.resetTime - now };
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

interface ChatMessage {
  role: string;
  content: string;
}

// Validate messages array
function validateMessages(data: unknown): { valid: true; messages: ChatMessage[] } | { valid: false; error: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request format" };
  }

  const { messages } = data as Record<string, unknown>;

  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }

  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }

  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages. Maximum is ${MAX_MESSAGES}` };
  }

  let totalContentLength = 0;
  const validatedMessages: ChatMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: `Invalid message at index ${i}` };
    }

    const { role, content } = msg as Record<string, unknown>;

    if (typeof role !== "string" || !["user", "assistant", "system"].includes(role)) {
      return { valid: false, error: `Invalid role at index ${i}` };
    }

    if (typeof content !== "string") {
      return { valid: false, error: `Invalid content at index ${i}` };
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message too long at index ${i}. Maximum is ${MAX_MESSAGE_LENGTH} characters` };
    }

    totalContentLength += content.length;

    if (totalContentLength > MAX_TOTAL_CONTENT_LENGTH) {
      return { valid: false, error: `Total content too long. Maximum is ${MAX_TOTAL_CONTENT_LENGTH} characters` };
    }

    validatedMessages.push({ role, content: content.trim() });
  }

  return { valid: true, messages: validatedMessages };
}

const systemPrompt = `You are a knowledgeable wood consultant for Yew & Grain, a premium supplier of rare English Yew timber from The Lake District, Cumbria.

Your expertise includes:
- English Yew (Taxus baccata) characteristics, grain patterns, and workability
- Recommending the right product type: slabs for furniture/tables, turning blanks for bowls/spindles, dimensional lumber for smaller projects
- Understanding moisture content, seasoning, and wood preparation
- Helping customers choose between Character Grade (more knots, figure) and Prime Grade (cleaner, uniform)
- Explaining live-edge vs. milled edges
- Advising on finishing techniques for yew

Current inventory includes:
- Heritage Slab A: 48"×18"×2.5", Prime Grade, Live Edge - £2,850
- Heartwood Slab B: 52"×22"×3", Character Grade, Live Edge - £3,200
- Bowl Blank Set: 8"×8"×4", Prime Grade - £185
- Dimensional Stock: 36"×6"×1.5", Select Grade - £420
- Bookmatched Pair: 60"×24"×2", Prime Grade, Live Edge - £4,800
- Spindle Blanks Set: 3"×3"×12", Character Grade - £95

Key selling points:
- All timber is sustainably salvaged from a ~180-year-old Yew felled in The Lake District in January 2026
- Precision-milled and slow-seasoned at our Lake District workshop
- Each piece is unique with distinctive amber tones and intricate grain patterns
- Shipping quoted individually from Cumbria

Be warm, knowledgeable, and helpful. Ask clarifying questions about their project to make better recommendations. Keep responses concise but informative (2-4 sentences typically). If they're ready to purchase, direct them to click "Inquire via Email" on any product.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP);
  
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment before trying again." }),
      {
        status: 429,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000))
        },
      }
    );
  }

  try {
    // Parse and validate input
    let rawData: unknown;
    try {
      rawData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validation = validateMessages(rawData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = validation;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing chat request from IP: ${clientIP}, messages: ${messages.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're experiencing high demand. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "Unable to connect to AI service" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Wood consultant error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

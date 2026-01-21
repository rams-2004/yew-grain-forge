import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
        return new Response(JSON.stringify({ error: "We're experiencing high demand. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Unable to connect to AI service" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Wood consultant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

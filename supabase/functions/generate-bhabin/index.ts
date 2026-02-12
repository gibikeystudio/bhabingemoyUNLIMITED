import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { imageBase64, scene, color, villagerCount = 1 } = await req.json();

    if (!imageBase64) {
      console.error("No image provided");
      return new Response(
        JSON.stringify({ error: "Foto belum diupload" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API Key tidak dikonfigurasi" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build villager description
    const randomColors = ["red", "blue", "green", "white", "yellow", "black", "orange", "purple", "brown", "pink"];
    let villagerDesc = "";
    if (villagerCount === 1) {
      villagerDesc = `one local villager wearing a ${color} shirt`;
    } else {
      const otherColors = randomColors.filter(c => c !== color);
      const shuffled = otherColors.sort(() => Math.random() - 0.5);
      const others = shuffled.slice(0, villagerCount - 1).map(c => `${c} shirt`).join(", ");
      villagerDesc = `${villagerCount} local villagers together. One villager wears a ${color} shirt, the others wear ${others}`;
    }

    const prompt = `8K PHOTOREALISTIC DOCUMENTARY PHOTO. An Indonesian Bhabinkamtibmas police officer (with the EXACT same face and uniform from the source image) is actively interacting and talking with ${villagerDesc} at ${scene}. The officer is delivering kamtibmas community safety messages, gesturing naturally while speaking. The villagers are listening attentively and engaged in conversation. Shot like a real documentation photo with natural lighting, warm community atmosphere, genuine human interaction. Professional DSLR photography, sharp details, candid documentary style.`;

    console.log("Generating image with prompt:", prompt);
    console.log("Scene:", scene, "Color:", color, "Villagers:", villagerCount);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Terlalu banyak request. Coba lagi nanti ya!" }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credit AI habis. Hubungi admin untuk top up." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Gagal generate foto. Coba lagi ya!" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("AI Response received");

    // Extract the generated image from the response
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Waduh, AI-nya lagi malu-malu. Coba lagi ya!" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        image: generatedImage,
        message: data.choices?.[0]?.message?.content || "Foto berhasil dibuat!"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in generate-bhabin function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Terjadi kesalahan" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_MODELS = [
  {
    model_id: "openai:gpt-4o",
    model_name: "GPT-4 Optimized",
    provider: "OpenAI",
    capabilities: {
      tasks: ["text-generation", "reasoning"],
      features: ["chat", "function-calling"]
    },
    version: "latest",
    is_available: true
  },
  {
    model_id: "anthropic:claude-3-5-sonnet",
    model_name: "Claude 3 Sonnet",
    provider: "Anthropic",
    capabilities: {
      tasks: ["text-generation", "reasoning", "multimodal"],
      features: ["chat", "vision"]
    },
    version: "20240620",
    is_available: true
  },
  {
    model_id: "google:gemini-pro",
    model_name: "Gemini Pro",
    provider: "Google",
    capabilities: {
      tasks: ["text-generation", "reasoning"],
      features: ["chat", "function-calling"]
    },
    version: "latest",
    is_available: true
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Syncing default AI models');

    const { data, error } = await supabase
      .from('ai_suite_models')
      .upsert(
        DEFAULT_MODELS,
        { onConflict: 'model_id' }
      );

    if (error) {
      console.error('Error upserting models:', error);
      throw error;
    }

    console.log('Successfully synced AI models:', data);

    return new Response(
      JSON.stringify({ success: true, message: 'Models synced successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing AI models:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
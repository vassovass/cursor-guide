import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { modelId, input, systemPrompt, task } = await req.json();
    console.log(`Processing ${task} with system prompt`);

    // Get API key configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: modelConfig, error: configError } = await supabase
      .from('api_model_configs')
      .select('api_key')
      .eq('model_id', modelId)
      .single();

    if (configError || !modelConfig?.api_key) {
      throw new Error('API key not configured for this model');
    }

    // Initialize environment
    const provider = modelId.split(':')[0].toUpperCase();
    const envKey = `${provider}_API_KEY`;
    Deno.env.set(envKey, modelConfig.api_key);

    // Process with AI using system prompt
    const command = new Deno.Command("python3", {
      args: ["-c", `
import aisuite as ai
import json
import os

client = ai.Client()
messages = [
    {"role": "system", "content": """${systemPrompt}"""},
    {"role": "user", "content": """${input}"""}
]

response = client.chat.completions.create(
    model="${modelId}",
    messages=messages,
    temperature=0.7
)

print(json.dumps({"content": response.choices[0].message.content}))
      `],
      env: {
        [envKey]: modelConfig.api_key,
      }
    });

    const { stdout } = await command.output();
    const result = JSON.parse(new TextDecoder().decode(stdout));

    return new Response(JSON.stringify({
      status: 'success',
      output: result.content,
      model: modelId,
      task: task
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-suite-process function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
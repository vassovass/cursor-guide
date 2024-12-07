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
    const { modelId } = await req.json();
    console.log(`Testing connection for model: ${modelId}`);

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

    // Test connection based on provider
    const provider = modelId.split(':')[0];
    let testResult;

    switch (provider) {
      case 'openai':
        testResult = await testOpenAIConnection(modelConfig.api_key);
        break;
      case 'anthropic':
        testResult = await testAnthropicConnection(modelConfig.api_key);
        break;
      default:
        throw new Error('Unsupported AI provider');
    }

    return new Response(JSON.stringify(testResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in test-ai-connection function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function testOpenAIConnection(apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to connect to OpenAI API');
  }

  return { status: 'success', provider: 'openai' };
}

async function testAnthropicConnection(apiKey: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Test connection' }],
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to connect to Anthropic API');
  }

  return { status: 'success', provider: 'anthropic' };
}
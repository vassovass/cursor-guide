import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fetch latest models from AI Suite's GitHub repository
async function fetchLatestAISuiteModels() {
  try {
    const response = await fetch('https://api.github.com/repos/andrewyng/aisuite/contents/aisuite/providers');
    const files = await response.json();
    
    const providers = files
      .filter((file: any) => file.name.endsWith('_provider.py'))
      .map((file: any) => file.name.replace('_provider.py', ''));

    const models = providers.flatMap((provider: string) => {
      const defaultModels = {
        'openai': [
          { model_id: 'gpt-4o', name: 'GPT-4 Optimized', version: 'latest' },
          { model_id: 'gpt-4o-mini', name: 'GPT-4 Mini', version: 'latest' }
        ],
        'anthropic': [
          { model_id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', version: '20240620' },
          { model_id: 'claude-3-opus', name: 'Claude 3 Opus', version: '20240620' }
        ],
        'google': [
          { model_id: 'gemini-pro', name: 'Gemini Pro', version: 'latest' }
        ],
        'groq': [
          { model_id: 'mixtral-8x7b', name: 'Mixtral 8x7B', version: 'latest' }
        ],
        'perplexity': [
          { model_id: 'pplx-7b', name: 'PPLX-7B', version: 'latest' }
        ],
        'mistral': [
          { model_id: 'mistral-large', name: 'Mistral Large', version: 'latest' }
        ],
        'huggingface': [
          { model_id: 'meta-llama/Llama-2-70b', name: 'Llama 2 70B', version: 'latest' }
        ]
      };

      const providerModels = defaultModels[provider as keyof typeof defaultModels] || [];
      return providerModels.map(model => ({
        model_id: `${provider}:${model.model_id}`,
        model_name: model.name,
        provider: provider.charAt(0).toUpperCase() + provider.slice(1),
        capabilities: {
          tasks: ['text-generation'],
          features: ['chat']
        },
        version: model.version,
        is_available: true
      }));
    });

    return models;
  } catch (error) {
    console.error('Error fetching AI Suite models:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Fetching latest AI Suite models');
    const models = await fetchLatestAISuiteModels();
    
    console.log('Syncing models with database');
    const { data, error } = await supabase
      .from('ai_suite_models')
      .upsert(
        models,
        { onConflict: 'model_id' }
      );

    if (error) {
      console.error('Error upserting models:', error);
      throw error;
    }

    console.log('Successfully synced AI models:', data);

    return new Response(
      JSON.stringify({ success: true, message: 'Models synced successfully', models: data }),
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
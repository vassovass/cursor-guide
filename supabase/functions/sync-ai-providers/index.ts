import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Provider {
  provider_id: string;
  provider_name: string;
  is_available: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[sync-ai-providers] Starting provider sync');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define providers based on your screenshot
    const providers: Provider[] = [
      { provider_id: 'anthropic', provider_name: 'Anthropic', is_available: true },
      { provider_id: 'aws', provider_name: 'AWS', is_available: true },
      { provider_id: 'azure', provider_name: 'Azure', is_available: true },
      { provider_id: 'google', provider_name: 'Google', is_available: true },
      { provider_id: 'groq', provider_name: 'Groq', is_available: true },
      { provider_id: 'huggingface', provider_name: 'Hugging Face', is_available: true },
      { provider_id: 'openai', provider_name: 'OpenAI', is_available: true },
      { provider_id: 'sambanova', provider_name: 'SambaNova', is_available: true },
      { provider_id: 'xai', provider_name: 'xAI', is_available: true }
    ];

    console.log('[sync-ai-providers] Providers to sync:', providers);

    // Upsert providers to database
    const { data, error } = await supabase
      .from('ai_providers')
      .upsert(providers, {
        onConflict: 'provider_id',
        ignoreDuplicates: false
      });

    if (error) throw error;

    console.log('[sync-ai-providers] Successfully synced providers:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Providers synced successfully', 
        providers: data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('[sync-ai-providers] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
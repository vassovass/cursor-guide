import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { parse } from 'https://deno.land/std@0.168.0/encoding/toml.ts';

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
    console.log('[sync-ai-providers] Starting provider sync from vassovass/aisuite pyproject.toml');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch pyproject.toml from your forked repository's main branch
    const repoUrl = 'https://raw.githubusercontent.com/vassovass/aisuite/main/pyproject.toml';
    console.log('[sync-ai-providers] Fetching from:', repoUrl);

    const response = await fetch(repoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch pyproject.toml: ${response.statusText}`);
    }

    const tomlContent = await response.text();
    const config = parse(tomlContent);
    console.log('[sync-ai-providers] Parsed TOML:', config);

    // Extract providers from the tool.poetry.extras section
    const extras = config?.tool?.poetry?.extras || {};
    const providers: Provider[] = Object.keys(extras)
      .filter(key => !['tests', 'dev'].includes(key))
      .map(providerId => ({
        provider_id: providerId,
        provider_name: providerId.charAt(0).toUpperCase() + providerId.slice(1),
        is_available: true
      }));

    console.log('[sync-ai-providers] Extracted providers:', providers);

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
        message: 'Providers synced successfully from vassovass/aisuite pyproject.toml', 
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
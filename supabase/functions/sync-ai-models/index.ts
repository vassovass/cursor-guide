import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchAISuiteProviders() {
  try {
    console.log('[sync-ai-models] Fetching AI Suite providers');
    
    // TODO: Replace with actual AI Suite API endpoint when available
    const aiSuiteApiUrl = 'https://api.github.com/repos/andrew-ng/ai-suite/contents/providers';
    
    const response = await fetch(aiSuiteApiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch AI Suite providers: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[sync-ai-models] Raw provider data:', data);

    // Transform the data to match our database schema
    const providers = data.map((file: any) => {
      const providerName = file.name.replace('_provider.py', '');
      return {
        provider_id: providerName.toLowerCase(),
        provider_name: providerName.charAt(0).toUpperCase() + providerName.slice(1),
        is_available: true,
        source: 'ai_suite',
        version: file.sha // Track the file version
      };
    });

    console.log('[sync-ai-models] Processed providers:', providers);
    return providers;
  } catch (error) {
    console.error('[sync-ai-models] Error fetching AI Suite providers:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[sync-ai-models] Function invoked');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const providers = await fetchAISuiteProviders();
    
    console.log('[sync-ai-models] Syncing providers with database');
    const { data, error } = await supabase
      .from('ai_providers')
      .upsert(
        providers,
        { 
          onConflict: 'provider_id',
          ignoreDuplicates: false 
        }
      );

    if (error) {
      console.error('[sync-ai-models] Error upserting providers:', error);
      throw error;
    }

    console.log('[sync-ai-models] Successfully synced AI providers:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Providers synced successfully', 
        providers: data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[sync-ai-models] Error syncing AI providers:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
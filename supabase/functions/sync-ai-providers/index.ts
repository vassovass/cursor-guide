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
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Define default providers in case GitHub fetch fails
    const defaultProviders: Provider[] = [
      {
        provider_id: 'openai',
        provider_name: 'OpenAI',
        is_available: true
      },
      {
        provider_id: 'anthropic',
        provider_name: 'Anthropic',
        is_available: true
      }
    ];

    let providers: Provider[] = defaultProviders;

    try {
      // Attempt to fetch from GitHub with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        'https://api.github.com/repos/andrew-ng/ai-suite/contents/providers',
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (response.ok) {
        const files = await response.json();
        console.log('[sync-ai-providers] Fetched providers:', files);

        providers = files
          .filter((file: any) => file.name.endsWith('_provider.py'))
          .map((file: any) => {
            const providerName = file.name.replace('_provider.py', '');
            return {
              provider_id: providerName.toLowerCase(),
              provider_name: providerName
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              is_available: true
            };
          });
      } else {
        console.warn('[sync-ai-providers] Failed to fetch from GitHub, using default providers');
      }
    } catch (error) {
      console.warn('[sync-ai-providers] Error fetching from GitHub:', error);
      console.log('[sync-ai-providers] Using default providers');
    }

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
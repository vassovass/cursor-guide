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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[sync-ai-providers] Starting provider sync');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch providers from AI Suite repository
    const response = await fetch('https://api.github.com/repos/andrew-ng/ai-suite/contents/providers');
    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.statusText}`);
    }

    const files = await response.json();
    console.log('[sync-ai-providers] Fetched providers:', files);

    // Transform provider files into provider records
    const providers: Provider[] = files
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

    console.log('[sync-ai-providers] Transformed providers:', providers);

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
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

async function fetchProviderFiles() {
  try {
    const response = await fetch('https://api.github.com/repos/vassovass/aisuite/contents/aisuite/providers');
    if (!response.ok) {
      throw new Error(`Failed to fetch provider directory: ${response.statusText}`);
    }
    const files = await response.json();
    return files.filter((file: any) => 
      file.name.endsWith('_provider.py') && 
      file.type === 'file'
    );
  } catch (error) {
    console.error('[sync-ai-providers] Error fetching provider files:', error);
    throw new Error('Failed to fetch provider files from repository');
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[sync-ai-providers] Starting provider sync from vassovass/aisuite providers directory');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch provider files from the repository
    const providerFiles = await fetchProviderFiles();
    console.log('[sync-ai-providers] Found provider files:', providerFiles);

    // Transform provider files into our database format
    const providers: Provider[] = providerFiles.map((file: any) => {
      const providerName = file.name.replace('_provider.py', '');
      return {
        provider_id: providerName.toLowerCase(),
        provider_name: providerName.charAt(0).toUpperCase() + providerName.slice(1),
        is_available: true
      };
    });

    // Add Perplexity provider if not already present
    const perplexityProvider = providers.find(p => p.provider_id === 'perplexity');
    if (!perplexityProvider) {
      providers.push({
        provider_id: 'perplexity',
        provider_name: 'Perplexity',
        is_available: true
      });
    }

    console.log('[sync-ai-providers] Processed providers:', providers);

    // Upsert providers to database with error handling
    const { data, error } = await supabase
      .from('ai_providers')
      .upsert(providers, {
        onConflict: 'provider_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('[sync-ai-providers] Database error:', error);
      throw error;
    }

    console.log('[sync-ai-providers] Successfully synced providers:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Providers synced successfully from vassovass/aisuite providers directory', 
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
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
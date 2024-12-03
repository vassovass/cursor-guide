import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const aiSuiteApiUrl = Deno.env.get('AI_SUITE_API_URL')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!)
    
    // Fetch models from AI Suite API
    const response = await fetch(`${aiSuiteApiUrl}/models`)
    const aiSuiteModels = await response.json()

    // Update local database with AI Suite models
    const { data, error } = await supabase
      .from('ai_suite_models')
      .upsert(
        aiSuiteModels.map((model: any) => ({
          model_id: model.id,
          model_name: model.name,
          provider: model.provider,
          capabilities: model.capabilities,
          version: model.version,
          is_available: model.isAvailable
        })),
        { onConflict: 'model_id' }
      )

    if (error) throw error

    console.log('Successfully synced AI models:', data)

    return new Response(
      JSON.stringify({ success: true, message: 'Models synced successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error syncing AI models:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
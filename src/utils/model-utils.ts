import { AiModel, GroupedModels } from '@/types/ai-models';
import { supabase } from '@/integrations/supabase/client';

export const transformSupabaseModel = (model: any): AiModel => {
  return {
    id: model.id,
    model_id: model.model_id,
    model_name: model.model_name,
    provider: model.provider,
    is_available: model.is_available,
    version: model.version,
    capabilities: {
      tasks: Array.isArray(model.capabilities?.tasks) ? model.capabilities.tasks : [],
      features: Array.isArray(model.capabilities?.features) ? model.capabilities.features : []
    }
  };
};

export const fetchAvailableModels = async (): Promise<AiModel[]> => {
  const { data, error } = await supabase
    .from('ai_suite_models')
    .select('*')
    .eq('is_available', true);

  if (error) throw error;
  return (data as any[]).map(transformSupabaseModel);
};

export const saveModelApiKey = async (
  modelId: string,
  modelName: string,
  apiKey: string,
  isEnabled: boolean
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('api_model_configs')
    .upsert({
      model_id: modelId,
      model_name: modelName,
      api_key: apiKey,
      is_enabled: isEnabled,
      user_id: user.id,
      last_verified_at: new Date().toISOString()
    });

  if (error) throw error;
};

export const fetchUserModelConfigs = async () => {
  const { data, error } = await supabase
    .from('api_model_configs')
    .select('*');

  if (error) throw error;
  return data;
};
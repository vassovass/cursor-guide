import { AiModel, GroupedModels, SupabaseAiModel } from '@/types/ai-models';
import { supabase } from '@/integrations/supabase/client';

export const transformSupabaseModel = (model: SupabaseAiModel): AiModel => {
  const capabilities = model.capabilities as { tasks?: string[], features?: string[] } | null;
  
  return {
    id: model.id,
    model_id: model.model_id,
    model_name: model.model_name,
    provider: model.provider,
    is_available: model.is_available,
    version: model.version,
    capabilities: {
      tasks: Array.isArray(capabilities?.tasks) ? capabilities.tasks : [],
      features: Array.isArray(capabilities?.features) ? capabilities.features : []
    }
  };
};

export const fetchAvailableModels = async (): Promise<AiModel[]> => {
  const { data, error } = await supabase
    .from('ai_suite_models')
    .select('*')
    .eq('is_available', true);

  if (error) throw error;
  return (data as SupabaseAiModel[]).map(transformSupabaseModel);
};

export const groupModelsByProvider = (models: AiModel[]): GroupedModels => {
  const grouped: GroupedModels = {};
  
  models.forEach(model => {
    const provider = model.provider;
    if (!grouped[provider]) {
      grouped[provider] = [];
    }
    if (!grouped[provider].find(m => m.model_id === model.model_id)) {
      grouped[provider].push(model);
    }
  });
  
  return grouped;
};

export const groupModelsByCapability = (models: AiModel[] = []): GroupedModels => {
  const grouped: GroupedModels = {};
  
  models?.forEach(model => {
    model.capabilities.tasks.forEach(task => {
      if (!grouped[task]) {
        grouped[task] = [];
      }
      if (!grouped[task].find(m => m.model_id === model.model_id)) {
        grouped[task].push(model);
      }
    });
  });
  
  return grouped;
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
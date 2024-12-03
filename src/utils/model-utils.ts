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

export const groupModelsByCapability = (models: AiModel[] | undefined): GroupedModels => {
  if (!models) return {};
  
  const grouped: GroupedModels = {};
  
  models.forEach(model => {
    if (model.capabilities?.tasks) {
      model.capabilities.tasks.forEach(task => {
        if (!grouped[task]) {
          grouped[task] = [];
        }
        if (!grouped[task].find(m => m.model_id === model.model_id)) {
          grouped[task].push(model);
        }
      });
    }
  });
  
  return grouped;
};
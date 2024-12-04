import { supabase } from '@/integrations/supabase/client';

export const fetchUserModelConfigs = async () => {
  const { data, error } = await supabase
    .from('api_model_configs')
    .select('*');

  if (error) throw error;
  return data;
};
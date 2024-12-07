import { Dispatch, SetStateAction } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Log, AIModel } from "./types";

export async function logAIProviders(setLogs: Dispatch<SetStateAction<Log[]>>) {
  try {
    const { data, error: providersError } = await supabase.functions.invoke('sync-ai-models', {
      body: { action: 'fetch_providers' }
    });

    if (providersError) {
      throw providersError;
    }

    if (!data || !data.models) {
      console.log('Response data:', data);
      throw new Error('Invalid response format from sync-ai-models');
    }

    const providers = new Map<string, AIModel[]>();
    data.models.forEach((model: AIModel) => {
      if (!providers.has(model.provider)) {
        providers.set(model.provider, []);
      }
      providers.get(model.provider)?.push(model);
    });

    setLogs(prev => [...prev, {
      level: 'INFO',
      message: `Found ${providers.size} AI providers`,
      timestamp: new Date().toISOString()
    }]);

    providers.forEach((models: AIModel[], provider: string) => {
      setLogs(prev => [...prev, {
        level: 'INFO',
        message: `Provider: ${provider} (${models.length} models)`,
        timestamp: new Date().toISOString()
      }]);

      models.forEach((model: AIModel) => {
        setLogs(prev => [...prev, {
          level: 'INFO',
          message: `  - Model: ${model.model_name || 'Unknown'} (${model.model_id || 'No ID'})`,
          timestamp: new Date().toISOString()
        }]);
      });
    });

    setLogs(prev => [...prev, {
      level: 'INFO',
      message: 'AI Suite test completed successfully',
      timestamp: new Date().toISOString()
    }]);

  } catch (error) {
    setLogs(prev => [...prev, {
      level: 'ERROR',
      message: `AI Suite test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }]);
  }
}
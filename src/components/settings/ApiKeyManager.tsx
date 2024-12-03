import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelKeyInput } from './ModelKeyInput';
import { fetchAvailableModels, groupModelsByCapability, fetchUserModelConfigs } from '@/utils/model-utils';
import { ApiKey, CAPABILITY_LABELS } from '@/types/ai-models';

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const { data: availableModels, isError: isModelsError, refetch: refetchModels } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels,
  });

  const { data: userConfigs, refetch: refetchConfigs } = useQuery({
    queryKey: ['user-model-configs'],
    queryFn: fetchUserModelConfigs,
  });

  // Sync with AI Suite periodically
  useEffect(() => {
    const syncModels = async () => {
      try {
        await supabase.functions.invoke('sync-ai-models');
        refetchModels();
      } catch (error) {
        console.error('Error syncing models:', error);
      }
    };

    // Initial sync
    syncModels();

    // Set up periodic sync (every 5 minutes)
    const interval = setInterval(syncModels, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refetchModels]);

  useEffect(() => {
    if (availableModels) {
      fetchApiKeys();
    }
  }, [availableModels, userConfigs]);

  const fetchApiKeys = async () => {
    if (!userConfigs) return;

    const existingKeys = userConfigs;
    if (existingKeys && existingKeys.length > 0) {
      setApiKeys(existingKeys as ApiKey[]);
    } else if (availableModels) {
      const defaultKeys = availableModels.map(model => ({
        id: crypto.randomUUID(),
        model_id: model.model_id,
        model_name: model.model_name,
        is_enabled: true
      }));
      setApiKeys(defaultKeys);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isModelsError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-destructive">Error loading AI models. Please try again later.</div>
        </CardContent>
      </Card>
    );
  }

  const groupedModels = groupModelsByCapability(availableModels);
  const capabilities = Object.keys(groupedModels).sort();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border" data-testid="api-key-manager">
      <CardHeader>
        <CardTitle className="text-foreground">AI Model API Keys</CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure your API keys for different AI capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={capabilities[0]} className="space-y-4">
          <TabsList className="w-full h-auto flex-wrap gap-2">
            {capabilities.map(capability => (
              <TabsTrigger
                key={capability}
                value={capability}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {CAPABILITY_LABELS[capability] || capability}
              </TabsTrigger>
            ))}
          </TabsList>

          {capabilities.map(capability => (
            <TabsContent key={capability} value={capability} className="space-y-4">
              {groupedModels[capability].map((model) => {
                const existingConfig = userConfigs?.find(
                  config => config.model_id === model.model_id
                );
                return (
                  <ModelKeyInput
                    key={model.model_id}
                    model={model}
                    showKey={showKeys[model.id]}
                    onToggleVisibility={() => toggleKeyVisibility(model.id)}
                    existingApiKey={existingConfig?.api_key}
                    isEnabled={existingConfig?.is_enabled ?? true}
                  />
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
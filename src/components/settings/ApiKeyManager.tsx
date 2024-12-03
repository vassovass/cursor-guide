import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelKeyInput } from './ModelKeyInput';
import { fetchAvailableModels, groupModelsByCapability } from '@/utils/model-utils';
import { ApiKey, CAPABILITY_LABELS } from '@/types/ai-models';

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const { data: availableModels, isError: isModelsError } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels,
  });

  useEffect(() => {
    if (availableModels) {
      fetchApiKeys();
    }
  }, [availableModels]);

  const fetchApiKeys = async () => {
    const { data: existingKeys, error } = await supabase
      .from('api_model_configs')
      .select('*');

    if (error) {
      toast({
        title: "Error fetching API keys",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

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

  const saveKey = async (modelId: string, modelName: string, isEnabled: boolean) => {
    const { error } = await supabase
      .from('api_model_configs')
      .upsert({
        model_id: modelId,
        model_name: modelName,
        is_enabled: isEnabled,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

    if (error) {
      toast({
        title: "Error saving API key",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "API Key Saved",
      description: `API key for ${modelName} has been saved.`,
    });

    fetchApiKeys();
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
              {groupedModels[capability].map((model) => (
                <ModelKeyInput
                  key={model.model_id}
                  model={model}
                  showKey={showKeys[model.id]}
                  onToggleVisibility={() => toggleKeyVisibility(model.id)}
                  onSave={saveKey}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ApiKey {
  id: string;
  model_name: string;
  model_id: string;
  is_enabled: boolean;
}

interface AiModel {
  id: string;
  model_id: string;
  model_name: string;
  provider: string;
  is_available: boolean;
  version: string | null;
}

const fetchAvailableModels = async () => {
  const { data, error } = await supabase
    .from('ai_suite_models')
    .select('*')
    .eq('is_available', true);

  if (error) throw error;
  return data as AiModel[];
};

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
      // Create default keys for available models
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

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border" data-testid="api-key-manager">
      <CardHeader>
        <CardTitle className="text-foreground">AI Model API Keys</CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure your API keys for different AI models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="space-y-2 p-4 rounded-lg bg-muted/50" data-testid={`api-key-item-${apiKey.model_id}`}>
            <div className="flex justify-between items-center">
              <label htmlFor={apiKey.model_id} className="text-sm font-medium text-foreground">
                {apiKey.model_name}
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="text-muted-foreground hover:text-foreground"
                data-testid={`toggle-visibility-${apiKey.model_id}`}
              >
                {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id={apiKey.model_id}
                type={showKeys[apiKey.id] ? "text" : "password"}
                placeholder={`Enter ${apiKey.model_name} API key`}
                className="flex-1 bg-background text-foreground"
                data-testid={`api-key-input-${apiKey.model_id}`}
              />
              <Button
                onClick={() => saveKey(apiKey.model_id, apiKey.model_name, apiKey.is_enabled)}
                className="gap-2"
                data-testid={`save-key-${apiKey.model_id}`}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
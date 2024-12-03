import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  capabilities: {
    tasks: string[];
    features: string[];
  };
}

interface GroupedModels {
  [key: string]: AiModel[];
}

const CAPABILITY_LABELS = {
  'text-generation': 'Text Generation',
  'image-generation': 'Image Generation',
  'audio-transcription': 'Audio Processing',
  'multimodal': 'Multimodal',
  'reasoning': 'Reasoning & Analysis',
  'vision': 'Computer Vision',
};

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

  const groupModelsByCapability = (models: AiModel[] | undefined): GroupedModels => {
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
                {CAPABILITY_LABELS[capability as keyof typeof CAPABILITY_LABELS] || capability}
              </TabsTrigger>
            ))}
          </TabsList>

          {capabilities.map(capability => (
            <TabsContent key={capability} value={capability} className="space-y-4">
              {groupedModels[capability].map((model) => (
                <div 
                  key={model.model_id} 
                  className="space-y-2 p-4 rounded-lg bg-muted/50"
                  data-testid={`api-key-item-${model.model_id}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <label htmlFor={model.model_id} className="text-sm font-medium text-foreground">
                        {model.model_name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Provider: {model.provider}
                        {model.version && ` • Version: ${model.version}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(model.id)}
                      className="text-muted-foreground hover:text-foreground"
                      data-testid={`toggle-visibility-${model.model_id}`}
                    >
                      {showKeys[model.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id={model.model_id}
                      type={showKeys[model.id] ? "text" : "password"}
                      placeholder={`Enter ${model.model_name} API key`}
                      className="flex-1 bg-background text-foreground"
                      data-testid={`api-key-input-${model.model_id}`}
                    />
                    <Button
                      onClick={() => saveKey(model.model_id, model.model_name, true)}
                      className="gap-2"
                      data-testid={`save-key-${model.model_id}`}
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
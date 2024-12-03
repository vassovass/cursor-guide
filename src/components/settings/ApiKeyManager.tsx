import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApiKey {
  id: string;
  model_name: string;
  model_id: string;
  is_enabled: boolean;
}

const DEFAULT_API_KEYS = [
  { model_name: 'GPT-4O', model_id: 'gpt4o', is_enabled: true },
  { model_name: 'GPT-4O Mini', model_id: 'gpt4o-mini', is_enabled: true },
];

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

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
      setApiKeys(existingKeys);
    } else {
      setApiKeys(DEFAULT_API_KEYS);
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

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background border-border">
      <CardHeader>
        <CardTitle className="text-foreground">AI Model API Keys</CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure your API keys for different AI models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.model_id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={apiKey.model_id} className="text-sm font-medium text-foreground">
                {apiKey.model_name}
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleKeyVisibility(apiKey.model_id)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showKeys[apiKey.model_id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id={apiKey.model_id}
                type={showKeys[apiKey.model_id] ? "text" : "password"}
                placeholder={`Enter ${apiKey.model_name} API key`}
                className="flex-1 bg-background text-foreground"
              />
              <Button
                onClick={() => saveKey(apiKey.model_id, apiKey.model_name, apiKey.is_enabled)}
                className="gap-2"
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
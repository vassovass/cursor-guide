import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAvailableModels, saveModelApiKey } from '@/utils/model-utils';

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const { data: models, isLoading, isError } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels,
  });

  // Group models by provider
  const providers = models ? [...new Set(models.map(model => model.provider))].sort() : [];

  const handleSave = async (provider: string) => {
    try {
      const providerModels = models?.filter(m => m.provider === provider);
      if (providerModels && providerModels.length > 0) {
        const firstModel = providerModels[0];
        await saveModelApiKey(
          firstModel.model_id,
          firstModel.model_name,
          apiKeys[provider] || '',
          true
        );
        toast({
          title: "API Key Saved",
          description: `API key for ${provider} has been saved successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error Saving API Key",
        description: error instanceof Error ? error.message : "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-muted-foreground">Loading available AI providers...</div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-destructive">Error loading AI providers. Please try again later.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Provider Configuration</CardTitle>
        <CardDescription>
          Configure your API keys for different AI providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            To use AI models, you'll need to provide API keys for each provider. These keys are stored securely and can be updated at any time.
          </AlertDescription>
        </Alert>

        {providers.map(provider => (
          <div key={provider} className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">{provider}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleKeyVisibility(provider)}
              >
                {showKeys[provider] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                type={showKeys[provider] ? "text" : "password"}
                value={apiKeys[provider] || ''}
                onChange={(e) => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                placeholder={`Enter ${provider} API Key`}
                className="flex-1"
              />
              <Button onClick={() => handleSave(provider)} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Available models: {models?.filter(m => m.provider === provider).map(m => m.model_name).join(', ')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
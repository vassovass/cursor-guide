import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Save } from 'lucide-react';
import { AiModel } from '@/types/ai-models';
import { saveModelApiKey } from '@/utils/model-utils';

interface SimpleApiKeyManagerProps {
  models: AiModel[];
}

export function SimpleApiKeyManager({ models }: SimpleApiKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Get unique providers
  const providers = [...new Set(models.map(model => model.provider))];

  const handleSave = async (provider: string) => {
    try {
      const providerModels = models.filter(m => m.provider === provider);
      if (providerModels.length > 0) {
        const model = providerModels[0];
        await saveModelApiKey(
          model.model_id,
          model.model_name,
          apiKeys[provider] || '',
          true
        );
        toast({
          title: "Success",
          description: `API key for ${provider} has been saved.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  if (providers.length === 0) {
    return <div>No AI providers available.</div>;
  }

  return (
    <div className="space-y-8">
      {providers.map(provider => (
        <div key={provider} className="space-y-4 p-6 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <Label className="text-xl font-semibold">{provider}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleVisibility(provider)}
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
              onChange={(e) => setApiKeys(prev => ({ 
                ...prev, 
                [provider]: e.target.value 
              }))}
              placeholder={`Enter ${provider} API Key`}
              className="flex-1"
            />
            <Button onClick={() => handleSave(provider)} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Available models:
            <ul className="mt-2 list-disc list-inside">
              {models
                .filter(m => m.provider === provider)
                .map(model => (
                  <li key={model.model_id}>{model.model_name}</li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
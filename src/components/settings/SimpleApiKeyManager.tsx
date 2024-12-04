import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, KeyRound } from 'lucide-react';
import { AiModel } from '@/types/ai-models';
import { saveModelApiKey } from '@/utils/model-utils';

interface SimpleApiKeyManagerProps {
  models: AiModel[];
}

export function SimpleApiKeyManager({ models }: SimpleApiKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
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

  if (providers.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No AI providers available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {providers.map(provider => (
        <div key={provider} className="p-6 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="h-5 w-5 text-primary" />
            <Label className="text-xl font-semibold">{provider}</Label>
          </div>
          
          <div className="flex gap-4 mb-4">
            <Input
              type="password"
              value={apiKeys[provider] || ''}
              onChange={(e) => setApiKeys(prev => ({ 
                ...prev, 
                [provider]: e.target.value 
              }))}
              placeholder={`Enter ${provider} API Key`}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSave(provider)} 
              className="gap-2 min-w-[100px]"
              variant="default"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Available models:</p>
            <ul className="list-disc list-inside space-y-1">
              {models
                .filter(m => m.provider === provider)
                .map(model => (
                  <li key={model.model_id} className="text-foreground/80">
                    {model.model_name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { AiModel } from '@/types/ai-models';

interface SimpleApiKeyFormProps {
  models: AiModel[];
}

export function SimpleApiKeyForm({ models }: SimpleApiKeyFormProps) {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Get unique providers
  const providers = [...new Set(models.map(model => model.provider))];

  const handleSave = async (provider: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save API keys",
          variant: "destructive",
        });
        return;
      }

      const providerModels = models.filter(m => m.provider === provider);
      if (providerModels.length > 0) {
        const firstModel = providerModels[0];
        
        await supabase
          .from('api_model_configs')
          .upsert({
            model_id: firstModel.model_id,
            model_name: firstModel.model_name,
            api_key: apiKeys[provider],
            user_id: user.id,
            is_enabled: true,
            last_verified_at: new Date().toISOString()
          });

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
    return <div>No AI providers available. Please check back later.</div>;
  }

  return (
    <div className="space-y-6">
      {providers.map(provider => (
        <div key={provider} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{provider}</h3>
          <div className="flex gap-4">
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
            <Button onClick={() => handleSave(provider)}>
              Save Key
            </Button>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Available models: {models.filter(m => m.provider === provider).map(m => m.model_name).join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
}
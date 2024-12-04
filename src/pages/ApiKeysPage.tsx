import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableModels } from "@/utils/model-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";

export function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: models, isLoading, error } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels
  });

  if (isLoading) {
    return <div className="p-8">Loading available AI providers...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading AI providers. Please try again.</div>;
  }

  // Get unique providers
  const providers = [...new Set(models?.map(model => model.provider) || [])];

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

      const providerModels = models?.filter(m => m.provider === provider);
      if (providerModels && providerModels.length > 0) {
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

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <Key className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">API Keys</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configure Provider API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {providers.length === 0 ? (
            <div>No AI providers available. Please check back later.</div>
          ) : (
            providers.map(provider => (
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
                  Available models: {models?.filter(m => m.provider === provider).map(m => m.model_name).join(', ')}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
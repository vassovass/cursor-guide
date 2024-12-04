import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAvailableModels } from "@/utils/model-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: models, isLoading, error } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels
  });

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-ai-models');
      
      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ['available-models'] });
      toast({
        title: "Success",
        description: "AI models have been synced successfully.",
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sync AI models",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

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

  // Get unique providers
  const providers = [...new Set(models?.map(model => model.provider) || [])];

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Key className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">API Keys</h1>
        </div>
        <Button 
          onClick={handleSync} 
          disabled={isSyncing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Models'}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configure Provider API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div>Loading available AI providers...</div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Error loading AI providers. Please try syncing to fetch the latest models.
              </AlertDescription>
            </Alert>
          ) : providers.length === 0 ? (
            <Alert>
              <AlertDescription>
                No AI providers available. Click the "Sync Models" button above to fetch the latest models.
              </AlertDescription>
            </Alert>
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
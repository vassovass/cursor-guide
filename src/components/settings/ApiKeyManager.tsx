import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAvailableModels, groupModelsByProvider, fetchUserModelConfigs } from '@/utils/model-utils';
import { ModelList } from './ModelList';

export function ApiKeyManager() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const { data: availableModels, isError: isModelsError, isLoading: isModelsLoading, refetch: refetchModels } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels,
  });

  const { data: userConfigs } = useQuery({
    queryKey: ['user-model-configs'],
    queryFn: fetchUserModelConfigs,
  });

  const syncModels = async () => {
    setIsSyncing(true);
    try {
      await supabase.functions.invoke('sync-ai-models');
      await refetchModels();
      toast({
        title: "Models Synced",
        description: "Successfully synchronized available AI models.",
      });
    } catch (error) {
      console.error('Error syncing models:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync AI models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (isModelsLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-muted-foreground">Loading available AI models...</div>
        </CardContent>
      </Card>
    );
  }

  if (isModelsError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-destructive">Error loading AI models. Please try again later.</div>
        </CardContent>
      </Card>
    );
  }

  const groupedModels = groupModelsByProvider(availableModels || []);
  const providers = Object.keys(groupedModels).sort();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border" data-testid="api-key-manager">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">AI Provider Configuration</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure your API keys for different AI providers
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={syncModels}
          disabled={isSyncing}
          className="ml-4"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync Models
        </Button>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertDescription>
            To use AI models, you'll need to provide API keys for each provider. These keys are stored securely and can be updated at any time.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {providers.length > 0 ? (
            providers.map(provider => (
              <div key={provider} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">{provider}</h3>
                <ModelList
                  models={groupedModels[provider]}
                  provider={provider}
                  showKeys={showKeys}
                  onToggleVisibility={(id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))}
                  userConfigs={userConfigs}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No AI providers available. Try syncing to fetch the latest models.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAvailableModels, groupModelsByCapability, fetchUserModelConfigs } from '@/utils/model-utils';
import { CAPABILITY_LABELS } from '@/types/ai-models';
import { ModelList } from './ModelList';

export function ApiKeyManager() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const { data: availableModels, isError: isModelsError, isLoading: isModelsLoading, refetch: refetchModels } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels,
  });

  const { data: userConfigs, refetch: refetchConfigs } = useQuery({
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
        description: "Successfully synchronized with latest AI Suite models.",
      });
    } catch (error) {
      console.error('Error syncing models:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync with AI Suite models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncModels();
    const interval = setInterval(syncModels, 60 * 60 * 1000); // Sync every hour
    return () => clearInterval(interval);
  }, []);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
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

  const groupedModels = groupModelsByCapability(availableModels);
  const capabilities = Object.keys(groupedModels).sort();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border" data-testid="api-key-manager">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">AI Model Configuration</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure your API keys for different AI capabilities
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

        {capabilities.length > 0 ? (
          <Tabs defaultValue={capabilities[0]} className="space-y-4">
            <TabsList className="w-full h-auto flex-wrap gap-2">
              {capabilities.map(capability => (
                <TabsTrigger
                  key={capability}
                  value={capability}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {CAPABILITY_LABELS[capability] || capability}
                </TabsTrigger>
              ))}
            </TabsList>

            {capabilities.map(capability => (
              <TabsContent key={capability} value={capability}>
                <ModelList
                  models={groupedModels[capability]}
                  capability={capability}
                  showKeys={showKeys}
                  onToggleVisibility={toggleKeyVisibility}
                  userConfigs={userConfigs}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No AI models available. Try syncing to fetch the latest models.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
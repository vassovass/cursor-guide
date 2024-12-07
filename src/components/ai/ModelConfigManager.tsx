import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";
import { ApiKeyCard } from "./ApiKeyCard";
import { ConfigurationForm } from "./ConfigurationForm";
import { useApiConfigs } from "@/hooks/use-api-configs";

export function ModelConfigManager() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const { configs: existingConfigs, isLoading, fetchConfigs } = useApiConfigs();

  const syncProviders = async () => {
    setIsSyncing(true);
    try {
      const response = await supabase.functions.invoke('sync-ai-providers');
      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "AI providers synced successfully",
      });

      await fetchData();
    } catch (error) {
      console.error("[ModelConfigManager] Error syncing providers:", error);
      toast({
        title: "Error",
        description: "Failed to sync AI providers",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchData = async () => {
    try {
      const { data: providers, error: providersError } = await supabase
        .from('ai_providers')
        .select('*')
        .eq('is_available', true);

      if (providersError) throw providersError;
      setAvailableProviders(providers || []);

      await fetchConfigs();
    } catch (error) {
      console.error("[ModelConfigManager] Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load configuration data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (authError) {
    return (
      <Alert>
        <AlertDescription>{authError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-card border rounded-lg">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">AI Provider Configuration</h2>
          <p className="text-muted-foreground">
            Configure your AI provider API keys
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={syncProviders}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Providers
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <Alert>
          <AlertDescription>
            Loading available AI providers... If this persists, please refresh the page.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <ConfigurationForm 
            providers={availableProviders}
            onConfigSaved={fetchConfigs}
          />

          {existingConfigs.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Configured API Keys</h3>
              <div className="grid gap-4">
                {existingConfigs.map((config) => (
                  <ApiKeyCard
                    key={config.id}
                    config={config}
                    onDelete={async (id) => {
                      await fetchConfigs();
                    }}
                    onUpdate={fetchConfigs}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
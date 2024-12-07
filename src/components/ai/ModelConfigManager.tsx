import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfigurationForm } from "./ConfigurationForm";
import { ModelConfigHeader } from "./ModelConfigHeader";
import { ExistingConfigs } from "./ExistingConfigs";
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
      <ModelConfigHeader onSync={syncProviders} isSyncing={isSyncing} />

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

          <ExistingConfigs
            configs={existingConfigs}
            onConfigDelete={async (id) => {
              await fetchConfigs();
            }}
            onConfigUpdate={fetchConfigs}
          />
        </>
      )}
    </div>
  );
}
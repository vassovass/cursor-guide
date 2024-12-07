import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";
import { ApiKeyInput } from "./ApiKeyInput";
import { ProviderSelect } from "./ProviderSelect";
import { ApiKeyCard } from "./ApiKeyCard";

interface ApiKeyConfig {
  id: string;
  provider: string;
  api_key: string;
  last_verified_at: string;
  notes?: string | null;
}

export function ModelConfigManager() {
  const [apiKey, setApiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [existingConfigs, setExistingConfigs] = useState<ApiKeyConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConfigs = async () => {
    try {
      const { data: configs, error: configsError } = await supabase
        .from('api_model_configs')
        .select('id, provider, api_key, last_verified_at, notes')
        .order('created_at', { ascending: false });

      if (configsError) throw configsError;
      setExistingConfigs(configs || []);
    } catch (error) {
      console.error("[ModelConfigManager] Error fetching configs:", error);
      toast({
        title: "Error",
        description: "Failed to load API configurations",
        variant: "destructive",
      });
    }
  };

  const syncProviders = async () => {
    setIsSyncing(true);
    try {
      const response = await supabase.functions.invoke('sync-ai-providers');
      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "AI providers synced successfully",
      });

      // Refresh providers list
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to configure AI providers");
      }

      if (!selectedProvider || !apiKey) {
        throw new Error("Please provide both a provider and an API key");
      }

      const { error: configError } = await supabase
        .from("api_model_configs")
        .upsert({
          user_id: user.id,
          provider: selectedProvider,
          model_id: 'default',
          model_name: 'Default Model',
          api_key: apiKey,
          last_verified_at: new Date().toISOString(),
        });

      if (configError) throw configError;

      await fetchConfigs();

      toast({
        title: "Success",
        description: "API key configured successfully",
      });

      setApiKey("");
      setSelectedProvider("");
    } catch (error) {
      console.error("[ModelConfigManager] Configuration error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <ProviderSelect 
              providers={availableProviders}
              selectedProvider={selectedProvider}
              onProviderChange={handleProviderChange}
            />
            <ApiKeyInput 
              apiKey={apiKey}
              onChange={handleApiKeyChange}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving API Key...
                </>
              ) : (
                'Save API Key'
              )}
            </Button>
          </form>

          {existingConfigs.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Configured API Keys</h3>
              <div className="grid gap-4">
                {existingConfigs.map((config) => (
                  <ApiKeyCard
                    key={config.id}
                    config={config}
                    onDelete={(id) => {
                      setExistingConfigs(configs => 
                        configs.filter(c => c.id !== id)
                      );
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
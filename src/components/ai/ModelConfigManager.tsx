import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ApiKeyInput } from "./ApiKeyInput";
import { ProviderSelect } from "./ProviderSelect";

export function ModelConfigManager() {
  const [apiKey, setApiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  console.log("[ModelConfigManager] Component initialized");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data: providers, error } = await supabase
          .from('ai_providers')
          .select('*')
          .eq('is_available', true);

        if (error) throw error;
        setAvailableProviders(providers || []);
      } catch (error) {
        console.error("[ModelConfigManager] Error fetching providers:", error);
        toast({
          title: "Error",
          description: "Failed to load available providers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [toast]);

  const handleProviderChange = (value: string) => {
    console.log("[ModelConfigManager] Selected provider changed:", value);
    setSelectedProvider(value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[ModelConfigManager] API key input changed");
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
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">AI Provider Configuration</h2>
        <p className="text-muted-foreground mb-8">
          Configure your AI provider API keys
        </p>
      </div>

      {isLoading ? (
        <Alert>
          <AlertDescription>
            Loading available AI providers... If this persists, please refresh the page.
          </AlertDescription>
        </Alert>
      ) : (
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
      )}
    </div>
  );
}
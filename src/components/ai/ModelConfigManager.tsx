import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ModelSelect } from "./ModelSelect";
import { ApiKeyInput } from "./ApiKeyInput";

export function ModelConfigManager() {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  console.log("[ModelConfigManager] Component initialized");

  useEffect(() => {
    const fetchAvailableModels = async () => {
      console.log("[ModelConfigManager] Starting to fetch available AI models");
      try {
        const { data: session } = await supabase.auth.getSession();
        console.log("[ModelConfigManager] Auth session:", session?.session ? "exists" : "none");

        if (!session?.session) {
          setAuthError("Please sign in to configure AI models");
          setIsLoading(false);
          return;
        }

        const { data: models, error } = await supabase
          .from('ai_suite_models')
          .select('*')
          .eq('is_available', true);

        if (error) {
          console.error("[ModelConfigManager] Error fetching models:", error);
          throw error;
        }

        console.log("[ModelConfigManager] Fetched models:", models);
        setAvailableModels(models || []);
      } catch (error) {
        console.error("[ModelConfigManager] Failed to fetch models:", error);
        toast({
          title: "Error",
          description: "Failed to load available models. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableModels();
  }, [toast]);

  const handleModelChange = (value: string) => {
    console.log("[ModelConfigManager] Selected model changed:", value);
    setSelectedModel(value);
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
        throw new Error("You must be logged in to configure AI models");
      }

      if (!selectedModel || !apiKey) {
        throw new Error("Please provide both a model and an API key");
      }

      const { error: configError } = await supabase
        .from("api_model_configs")
        .upsert({
          user_id: user.id,
          model_id: selectedModel,
          model_name: selectedModel.split(":")[1],
          api_key: apiKey,
          last_verified_at: new Date().toISOString(),
        });

      if (configError) throw configError;

      const { error: testError } = await supabase.functions.invoke("test-ai-connection", {
        body: { 
          modelId: selectedModel,
          apiKey: apiKey 
        }
      });

      if (testError) throw testError;

      toast({
        title: "Success",
        description: "AI model configured successfully",
      });

      setApiKey("");
      setSelectedModel("");
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
        <h2 className="text-2xl font-bold">AI Model Configuration</h2>
        <p className="text-muted-foreground mb-8">
          Configure your AI model preferences and API keys
        </p>
      </div>

      {isLoading ? (
        <Alert>
          <AlertDescription>
            Loading available AI models... If this persists, please refresh the page.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <ModelSelect 
            models={availableModels}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
          <ApiKeyInput 
            apiKey={apiKey}
            onChange={handleApiKeyChange}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configuring...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
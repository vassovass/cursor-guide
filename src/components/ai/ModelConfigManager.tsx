import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function ModelConfigManager() {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const { toast } = useToast();

  console.log("[ModelConfigManager] Component initialized");

  useEffect(() => {
    const fetchAvailableModels = async () => {
      console.log("[ModelConfigManager] Fetching available AI models");
      try {
        const { data: models, error } = await supabase
          .from('ai_suite_models')
          .select('*')
          .eq('is_available', true);

        if (error) {
          console.error("[ModelConfigManager] Error fetching models:", error);
          throw error;
        }

        console.log("[ModelConfigManager] Available models:", models);
        setAvailableModels(models || []);
      } catch (error) {
        console.error("[ModelConfigManager] Failed to fetch models:", error);
        toast({
          title: "Error",
          description: "Failed to load available models",
          variant: "destructive",
        });
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
    console.log("[ModelConfigManager] Starting configuration process", {
      modelSelected: !!selectedModel,
      apiKeyProvided: !!apiKey
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("[ModelConfigManager] Authentication error: No user found");
        throw new Error("You must be logged in to configure AI models");
      }

      console.log("[ModelConfigManager] User authenticated:", { userId: user.id });

      // Validate inputs
      if (!selectedModel || !apiKey) {
        console.error("[ModelConfigManager] Validation error: Missing required fields");
        throw new Error("Please provide both a model and an API key");
      }

      console.log("[ModelConfigManager] Saving API key configuration to database");
      
      // Save API key configuration
      const { error: configError } = await supabase
        .from("api_model_configs")
        .upsert({
          user_id: user.id,
          model_id: selectedModel,
          model_name: selectedModel.split(":")[1],
          api_key: apiKey,
          last_verified_at: new Date().toISOString(),
        });

      if (configError) {
        console.error("[ModelConfigManager] Database error:", configError);
        throw configError;
      }

      console.log("[ModelConfigManager] Testing API connection");

      // Test connection with the API
      const { data: testResult, error: testError } = await supabase.functions.invoke("test-ai-connection", {
        body: { 
          modelId: selectedModel,
          apiKey: apiKey 
        }
      });

      if (testError) {
        console.error("[ModelConfigManager] Connection test failed:", testError);
        throw testError;
      }

      console.log("[ModelConfigManager] Connection test successful:", testResult);

      toast({
        title: "Success",
        description: "AI model configured successfully",
      });

      // Clear form
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
      console.log("[ModelConfigManager] Configuration process completed");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card border rounded-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">AI Model Configuration</h2>
        <p className="text-muted-foreground mb-8">
          Configure your AI model preferences and API keys
        </p>
      </div>

      {availableModels.length === 0 && (
        <Alert>
          <AlertDescription>
            Loading available AI models...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Model</label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.model_id} value={model.model_id}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        </div>

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
    </div>
  );
}
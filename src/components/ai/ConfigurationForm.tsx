import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ApiKeyInput } from "./ApiKeyInput";
import { ProviderSelect } from "./ProviderSelect";
import { supabase } from "@/integrations/supabase/client";

interface ConfigurationFormProps {
  onConfigSaved: () => void;
  providers: any[];
}

export function ConfigurationForm({ onConfigSaved, providers }: ConfigurationFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

      if (configError) {
        if (configError.code === '23505') {
          throw new Error(`You already have a configuration for ${selectedProvider}. Please delete it first if you want to add a new one.`);
        }
        throw configError;
      }

      toast({
        title: "Success",
        description: "API key configured successfully",
      });

      setApiKey("");
      setSelectedProvider("");
      onConfigSaved();
    } catch (error) {
      console.error("[ConfigurationForm] Configuration error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProviderSelect 
        providers={providers}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
      />
      <ApiKeyInput 
        apiKey={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
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
  );
}
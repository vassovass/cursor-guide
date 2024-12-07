import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { ApiKeyConfig } from "@/types/api-config";

export function useApiConfigs() {
  const [existingConfigs, setExistingConfigs] = useState<ApiKeyConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      console.error("[useApiConfigs] Error fetching configs:", error);
      toast({
        title: "Error",
        description: "Failed to load API configurations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (provider: string, apiKey: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to configure AI providers");
      }

      if (!provider || !apiKey) {
        throw new Error("Please provide both a provider and an API key");
      }

      const { error: configError } = await supabase
        .from("api_model_configs")
        .upsert({
          user_id: user.id,
          provider: provider,
          model_id: 'default',
          model_name: 'Default Model',
          api_key: apiKey,
          last_verified_at: new Date().toISOString(),
        });

      if (configError) {
        if (configError.code === '23505') {
          throw new Error(`You already have a configuration for ${provider}. Please delete it first if you want to add a new one.`);
        }
        throw configError;
      }

      await fetchConfigs();
      return true;
    } catch (error) {
      console.error("[useApiConfigs] Configuration error:", error);
      throw error;
    }
  };

  return {
    configs: existingConfigs,
    isLoading,
    fetchConfigs,
    saveConfig,
  };
}
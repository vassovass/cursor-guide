import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function ModelConfigManager() {
  const [selectedModel, setSelectedModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to configure AI models');
      }

      // Save API key configuration
      const { error } = await supabase
        .from('api_model_configs')
        .upsert({
          user_id: user.id,
          model_id: selectedModel,
          model_name: selectedModel.split(':')[1] || selectedModel,
          api_key: apiKey,
          last_verified_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Test connection with the API
      const { error: testError } = await supabase.functions.invoke('test-ai-connection', {
        body: { modelId: selectedModel }
      });

      if (testError) throw testError;

      toast({
        title: "Success",
        description: "AI model configuration has been saved and tested successfully.",
      });

      // Clear form
      setApiKey('');
      setSelectedModel('');
    } catch (error) {
      console.error('Error saving model configuration:', error);
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Model Configuration</CardTitle>
        <CardDescription>
          Configure your AI models and API keys for specification analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai:gpt-4o">OpenAI GPT-4 Optimized</SelectItem>
                <SelectItem value="openai:gpt-4o-mini">OpenAI GPT-4 Mini</SelectItem>
                <SelectItem value="anthropic:claude-3-opus">Anthropic Claude 3 Opus</SelectItem>
                <SelectItem value="anthropic:claude-3-sonnet">Anthropic Claude 3 Sonnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !selectedModel || !apiKey}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
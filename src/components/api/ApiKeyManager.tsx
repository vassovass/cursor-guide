import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to save an API key');
      }

      const { error } = await supabase
        .from('api_model_configs')
        .upsert({
          user_id: user.id,
          model_id: 'default-model',
          model_name: 'Default Model',
          api_key: apiKey,
          last_verified_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key has been saved successfully.",
      });

      // Clear form
      setApiKey('');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Key Management</CardTitle>
        <CardDescription>
          Enter your API key to enable AI processing capabilities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isSubmitting || !apiKey}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save API Key'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
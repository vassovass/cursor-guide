import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableModels } from "@/utils/model-utils";
import { SimpleApiKeyManager } from "@/components/settings/SimpleApiKeyManager";

export function SetupPage() {
  const { data: models, isLoading } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels,
  });

  return (
    <div className="container mx-auto space-y-6 py-8">
      <h1 className="text-3xl font-bold text-foreground">Model Setup</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Model Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading available models...</div>
          ) : (
            <SimpleApiKeyManager models={models || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
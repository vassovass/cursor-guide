import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAvailableModels } from "@/utils/model-utils";
import { useQuery } from "@tanstack/react-query";
import { SimpleApiKeyManager } from "@/components/settings/SimpleApiKeyManager";

export function SetupPage() {
  const { data: models, isLoading, error } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels
  });

  if (isLoading) {
    return <div className="p-8">Loading available AI providers...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading AI providers. Please try again.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Model Setup</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI Provider API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleApiKeyManager models={models || []} />
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableModels, groupModelsByCapability } from "@/utils/model-utils";
import { ApiKeyManager } from "@/components/settings/ApiKeyManager";
import { AiTester } from "@/components/ai/AiTester";

export function SetupPage() {
  const { data: models, isLoading } = useQuery({
    queryKey: ['available-models'],
    queryFn: fetchAvailableModels,
  });

  const groupedModels = groupModelsByCapability(models);

  return (
    <div className="container mx-auto space-y-6 py-8">
      <h1 className="text-3xl font-bold">Project Setup Guide</h1>
      
      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spec">Project Specification</TabsTrigger>
          <TabsTrigger value="models">AI Model Configuration</TabsTrigger>
          <TabsTrigger value="setup">Environment Setup</TabsTrigger>
          <TabsTrigger value="test">AI Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="spec">
          <Card>
            <CardHeader>
              <CardTitle>Project Specification</CardTitle>
              <CardDescription>Define your project requirements and let AI help refine them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-desc">Project Description</Label>
                <Textarea
                  id="project-desc"
                  placeholder="Describe your project in detail..."
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>Configure AI models and API keys for different capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {isLoading ? (
                  <div>Loading available models...</div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Text Generation Model</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select text generation model" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupedModels['text-generation']?.map((model) => (
                            <SelectItem key={model.model_id} value={model.model_id}>
                              {model.model_name} ({model.provider})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Chat Model</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chat model" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupedModels['chat']?.map((model) => (
                            <SelectItem key={model.model_id} value={model.model_id}>
                              {model.model_name} ({model.provider})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 border-t">
                <ApiKeyManager />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Environment Setup</CardTitle>
              <CardDescription>Configure your development environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">1. Install Required Tools</h3>
                <p>Install aisuite and required provider packages:</p>
                <pre className="bg-muted p-4 rounded-md">
                  pip install 'aisuite[all]'
                </pre>
                
                <h3 className="text-lg font-semibold">2. Configure Environment</h3>
                <p>Set up your development environment with the recommended settings.</p>
                
                <h3 className="text-lg font-semibold">3. Project Structure</h3>
                <p>Learn about the recommended project structure for optimal AI assistance.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <AiTester />
        </TabsContent>
      </Tabs>
    </div>
  );
}
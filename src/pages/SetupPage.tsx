import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SetupPage() {
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Project Setup Guide</h1>
      
      <Tabs defaultValue="spec" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spec">Project Specification</TabsTrigger>
          <TabsTrigger value="models">AI Model Configuration</TabsTrigger>
          <TabsTrigger value="setup">Environment Setup</TabsTrigger>
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
              <CardDescription>Configure AI models for different aspects of your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Text Processing Model</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select text model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4">GPT-4</SelectItem>
                      <SelectItem value="gpt4-preview">GPT-4 Preview</SelectItem>
                      <SelectItem value="claude">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Multimodal Processing</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select multimodal model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude">Claude 3</SelectItem>
                      <SelectItem value="gpt4-vision">GPT-4 Vision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Audio Processing</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audio model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whisper">Whisper</SelectItem>
                      <SelectItem value="deepgram">Deepgram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <p>Download and install the necessary development tools.</p>
                
                <h3 className="text-lg font-semibold">2. Configure Environment</h3>
                <p>Set up your development environment with the recommended settings.</p>
                
                <h3 className="text-lg font-semibold">3. Project Structure</h3>
                <p>Learn about the recommended project structure for optimal AI assistance.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
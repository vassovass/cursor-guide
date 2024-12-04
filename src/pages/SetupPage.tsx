import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SetupPage() {
  return (
    <div className="container mx-auto space-y-6 py-8">
      <h1 className="text-3xl font-bold">Project Setup Guide</h1>
      
      <Tabs defaultValue="spec" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spec">Project Specification</TabsTrigger>
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

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Environment Setup</CardTitle>
              <CardDescription>Configure your development environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">1. Install Required Tools</h3>
                <p>Install required development packages:</p>
                <pre className="bg-muted p-4 rounded-md">
                  npm install
                </pre>
                
                <h3 className="text-lg font-semibold">2. Configure Environment</h3>
                <p>Set up your development environment with the recommended settings.</p>
                
                <h3 className="text-lg font-semibold">3. Project Structure</h3>
                <p>Learn about the recommended project structure for optimal development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, FileJson, FileText } from "lucide-react";

export function SetupPage() {
  const [specification, setSpecification] = useState("");
  const [cursorRules, setCursorRules] = useState("");
  const { toast } = useToast();

  const handleSpecificationSubmit = async () => {
    if (!specification.trim()) {
      toast({
        title: "Specification Required",
        description: "Please enter your project specification before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Here we'll process the specification and generate cursor rules
    const processedRules = generateCursorRules(specification);
    setCursorRules(processedRules);

    toast({
      title: "Specification Processed",
      description: "Your project specification has been processed and Cursor.ai rules have been generated.",
    });
  };

  const generateCursorRules = (spec: string) => {
    // This is a simplified example - in reality, you'd want more sophisticated processing
    const rules = {
      projectName: "Generated Project",
      codeStyle: {
        framework: "React",
        typescript: true,
        styling: "Tailwind CSS",
        components: "shadcn/ui"
      },
      architecture: {
        pattern: "modular",
        dataFlow: "unidirectional",
        stateManagement: "context + reducers"
      },
      conventions: {
        naming: {
          components: "PascalCase",
          functions: "camelCase",
          constants: "UPPER_SNAKE_CASE"
        },
        fileStructure: {
          components: "src/components/**/",
          hooks: "src/hooks/",
          utils: "src/utils/"
        }
      }
    };
    return JSON.stringify(rules, null, 2);
  };

  return (
    <div className="container mx-auto space-y-6 py-8">
      <h1 className="text-3xl font-bold">Project Specification Guide</h1>
      
      <Tabs defaultValue="spec" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spec">Project Specification</TabsTrigger>
          <TabsTrigger value="cursor">Cursor.ai Rules</TabsTrigger>
          <TabsTrigger value="guide">Implementation Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="spec">
          <Card>
            <CardHeader>
              <CardTitle>Project Specification</CardTitle>
              <CardDescription>
                Enter your project requirements and let AI help refine them for Cursor.ai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-spec">Project Description</Label>
                <Textarea
                  id="project-spec"
                  placeholder="Describe your project in detail, including features, architecture preferences, and any specific requirements..."
                  className="min-h-[300px] font-mono"
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSpecificationSubmit}
                className="w-full"
              >
                Process Specification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursor">
          <Card>
            <CardHeader>
              <CardTitle>Generated Cursor.ai Rules</CardTitle>
              <CardDescription>
                These rules will guide Cursor.ai in understanding and implementing your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="font-mono text-sm">
                  {cursorRules || "Process your specification to generate Cursor.ai rules"}
                </pre>
              </ScrollArea>
              {cursorRules && (
                <div className="flex gap-4">
                  <Button variant="outline" className="w-full">
                    <FileJson className="mr-2 h-4 w-4" />
                    Download .cursorrules
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Documentation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>
                Follow these steps to implement your project with Cursor.ai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">1. Project Setup</h3>
                  <p className="text-muted-foreground">
                    Create a new project directory and place the generated .cursorrules file in the root.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">2. Documentation Structure</h3>
                  <p className="text-muted-foreground">
                    Set up the recommended documentation structure in your project.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">3. Implementation</h3>
                  <p className="text-muted-foreground">
                    Follow the generated documentation to implement your project features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
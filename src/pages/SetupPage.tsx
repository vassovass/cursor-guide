import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, FileJson, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SetupPage() {
  const [specification, setSpecification] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved specification and analysis from localStorage
    const savedSpec = localStorage.getItem("projectSpecification");
    const savedAnalysis = localStorage.getItem("aiAnalysis");
    
    if (savedSpec) {
      setSpecification(savedSpec);
    }
    
    if (savedAnalysis) {
      try {
        setAiAnalysis(JSON.parse(savedAnalysis));
      } catch (error) {
        console.error("Error parsing saved analysis:", error);
        toast({
          title: "Error",
          description: "Failed to load saved analysis",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

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
    const processedRules = generateCursorRules(specification, aiAnalysis);
    setCursorRules(processedRules);

    toast({
      title: "Specification Processed",
      description: "Your project specification has been processed and Cursor.ai rules have been generated.",
    });
  };

  const generateCursorRules = (spec: string, analysis: any) => {
    // Generate rules based on both specification and AI analysis
    const rules = {
      projectName: "AI-Enhanced Project",
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
      aiIntegration: {
        model: analysis?.model || "default",
        capabilities: analysis?.capabilities || [],
        recommendations: analysis?.recommendations || []
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
      <h1 className="text-3xl font-bold">Project Setup Guide</h1>
      
      {!aiAnalysis && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No AI Analysis Available</AlertTitle>
          <AlertDescription>
            Please complete the project specification step to get AI-powered recommendations.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="spec" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spec">Project Specification</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="cursor">Cursor.ai Rules</TabsTrigger>
          <TabsTrigger value="guide">Implementation Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="spec">
          <Card>
            <CardHeader>
              <CardTitle>Project Specification</CardTitle>
              <CardDescription>
                Review and edit your project requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-spec">Project Description</Label>
                <Textarea
                  id="project-spec"
                  placeholder="Your project specification will appear here..."
                  className="min-h-[300px] font-mono"
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                  readOnly
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>
                Review the AI-generated insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {aiAnalysis ? (
                  <pre className="font-mono text-sm whitespace-pre-wrap">
                    {JSON.stringify(aiAnalysis, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">No analysis results available</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursor">
          <Card>
            <CardHeader>
              <CardTitle>Generated Cursor.ai Rules</CardTitle>
              <CardDescription>
                AI-enhanced rules to guide Cursor.ai in implementing your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSpecificationSubmit}
                className="w-full"
                disabled={!aiAnalysis}
              >
                Generate Cursor.ai Rules
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="font-mono text-sm">
                  {aiAnalysis ? "Click Generate to create Cursor.ai rules" : "Complete AI analysis first"}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>
                AI-powered recommendations for implementing your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAnalysis ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">1. Project Setup</h3>
                      <p className="text-muted-foreground">
                        {aiAnalysis.setup || "Follow the recommended project structure and configuration."}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">2. AI Integration</h3>
                      <p className="text-muted-foreground">
                        {aiAnalysis.integration || "Implement the suggested AI features and endpoints."}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">3. Implementation Steps</h3>
                      <p className="text-muted-foreground">
                        {aiAnalysis.steps || "Follow the AI-recommended implementation sequence."}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Complete the AI analysis to get personalized implementation guidance.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
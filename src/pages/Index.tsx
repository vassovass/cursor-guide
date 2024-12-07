import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAiProcessing } from "@/hooks/use-ai-processing";
import { supabase } from "@/integrations/supabase/client";

export function Index() {
  const [specification, setSpecification] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { processWithAI, isProcessing } = useAiProcessing();

  const initializeFirstSprint = async (analysisResult: any) => {
    try {
      // Create first sprint
      const { data: sprint, error: sprintError } = await supabase
        .from("sprints")
        .insert({
          sprint_number: 1,
          title: "Initial Setup and Configuration",
          status: "active",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks duration
        })
        .select()
        .single();

      if (sprintError) throw sprintError;

      // Create initial tasks based on analysis
      const initialTasks = [
        {
          sprint_id: sprint.id,
          title: "Review and validate project specification",
          status: "in_progress",
          priority: 1,
        },
        {
          sprint_id: sprint.id,
          title: "Set up development environment",
          status: "pending",
          priority: 2,
        },
        {
          sprint_id: sprint.id,
          title: "Configure Cursor.ai integration",
          status: "pending",
          priority: 3,
        },
      ];

      const { error: tasksError } = await supabase
        .from("sprint_tasks")
        .insert(initialTasks);

      if (tasksError) throw tasksError;

      console.log("Sprint and tasks initialized successfully");
    } catch (error) {
      console.error("Error initializing sprint:", error);
      throw error;
    }
  };

  const handleSpecificationSubmit = async () => {
    if (!specification.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project specification",
        variant: "destructive",
      });
      return;
    }

    try {
      // Process the specification with AI using the SPECIFICATION_ANALYZER prompt
      const analysisResult = await processWithAI(
        "gpt-4o-mini",
        specification,
        "SPECIFICATION_ANALYZER",
        {
          projectType: "web-application",
          framework: "react",
          aiIntegration: true
        }
      );

      if (!analysisResult) {
        throw new Error("Failed to process specification");
      }

      // Store the analysis result
      const { error } = await supabase
        .from("ai_analysis_results")
        .insert({
          specification,
          analysis: analysisResult,
          model_id: "gpt-4o-mini",
        });

      if (error) throw error;

      // Initialize the first sprint
      await initializeFirstSprint(analysisResult);

      // Store in localStorage for immediate use
      localStorage.setItem("projectSpecification", specification);
      localStorage.setItem("aiAnalysis", JSON.stringify(analysisResult));

      toast({
        title: "Success",
        description: "Project initialized successfully. Redirecting to setup page...",
      });

      // Navigate to setup page
      navigate("/setup");
    } catch (error) {
      console.error("Error processing specification:", error);
      toast({
        title: "Error",
        description: "Failed to process specification. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Welcome to CursorGuide</h1>
          <p className="text-muted-foreground">
            Enter your project specification below to get started
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Enter your project specification here..."
            className="min-h-[200px]"
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
          />
          <Button 
            className="w-full" 
            onClick={handleSpecificationSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Analyze Specification"}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          <p>
            Your specification will be analyzed by AI to help set up your project
            structure and initialize your first sprint
          </p>
        </div>
      </div>
    </div>
  );
}
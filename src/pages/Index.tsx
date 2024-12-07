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

      // Store in localStorage for immediate use
      localStorage.setItem("projectSpecification", specification);
      localStorage.setItem("aiAnalysis", JSON.stringify(analysisResult));

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
            structure
          </p>
        </div>
      </div>
    </div>
  );
}
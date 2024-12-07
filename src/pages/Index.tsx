import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function Index() {
  const [specification, setSpecification] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSpecificationSubmit = () => {
    if (!specification.trim()) {
      toast({
        title: "Specification Required",
        description: "Please enter your project specification before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Log the specification for debugging
    console.log("Processing specification:", specification);

    // Store specification in localStorage for now (MVP)
    localStorage.setItem("project_specification", specification);
    
    toast({
      title: "Specification Received",
      description: "Your project specification has been processed. Proceeding to setup.",
    });

    // Navigate to setup page
    navigate("/setup");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            CursorGuide Project Specification
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your project specification below. We'll help you break it down
            and create Cursor.ai-friendly implementation guidelines.
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your project specification here..."
              className="min-h-[200px] resize-y"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
              data-testid="specification-input"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSpecificationSubmit}
                size="lg"
                data-testid="submit-specification"
              >
                Process Specification
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-sm text-muted-foreground text-center">
          <p>
            Your specification will be analyzed and broken down into
            structured tasks following Cursor.ai best practices.
          </p>
        </div>
      </div>
    </div>
  );
}
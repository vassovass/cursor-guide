import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAiProcessing } from '@/hooks/use-ai-processing';
import { Loader2 } from 'lucide-react';

export function SpecificationInput() {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const { processWithAI, isProcessing } = useAiProcessing();

  const parseSpecification = async (text: string) => {
    const result = await processWithAI(
      'gpt-4',
      text,
      'parseSpecification',
      { format: 'structured' }
    );
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First parse the specification
      const parsedData = await parseSpecification(content);

      // Then save both the original and parsed data
      const { error } = await supabase
        .from('project_specifications')
        .insert([
          {
            title,
            content,
            parsed_data: parsedData,
            status: 'draft'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Specification saved and parsed successfully",
      });

      // Clear form
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error saving specification:', error);
      toast({
        title: "Error",
        description: "Failed to save specification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Project Specification</CardTitle>
        <CardDescription>
          Enter your project requirements and we'll help analyze and structure them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter specification title"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Specification Details</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your project specification details..."
              className="min-h-[200px] w-full"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || isProcessing}
          >
            {(isSubmitting || isProcessing) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Save & Analyze Specification'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
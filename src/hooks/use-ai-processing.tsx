import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SYSTEM_PROMPTS, getPromptWithContext } from '@/config/system-prompts';

export function useAiProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processWithAI = async (
    modelId: string,
    input: string,
    task: keyof typeof SYSTEM_PROMPTS,
    context: Record<string, any> = {}
  ) => {
    setIsProcessing(true);
    try {
      const systemPrompt = getPromptWithContext(task, context);
      
      const { data, error } = await supabase.functions.invoke('ai-suite-process', {
        body: { 
          modelId, 
          input,
          systemPrompt,
          task
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error processing with AI:', error);
      toast({
        title: 'Error',
        description: 'Failed to process with AI. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processWithAI,
    isProcessing
  };
}
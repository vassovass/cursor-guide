import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useAiProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processWithAI = async (modelId: string, input: string, task: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-suite-process', {
        body: { modelId, input, task }
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
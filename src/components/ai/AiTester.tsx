import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAiProcessing } from '@/hooks/use-ai-processing';
import { Loader2 } from 'lucide-react';

export function AiTester() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { processWithAI, isProcessing } = useAiProcessing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await processWithAI('default-model', input, 'test');
    if (response) {
      setResult(response.output);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Suite Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your test input..."
              disabled={isProcessing}
            />
          </div>
          <Button type="submit" disabled={isProcessing || !input}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process with AI
          </Button>
          {result && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm">{result}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
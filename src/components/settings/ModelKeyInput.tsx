import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save } from 'lucide-react';
import { AiModel } from '@/types/ai-models';
import { useToast } from '@/components/ui/use-toast';
import { saveModelApiKey } from '@/utils/model-utils';

interface ModelKeyInputProps {
  model: AiModel;
  showKey: boolean;
  onToggleVisibility: () => void;
  existingApiKey?: string;
  isEnabled?: boolean;
}

export function ModelKeyInput({ 
  model, 
  showKey, 
  onToggleVisibility, 
  existingApiKey,
  isEnabled = true 
}: ModelKeyInputProps) {
  const [apiKey, setApiKey] = useState(existingApiKey || '');
  const { toast } = useToast();

  useEffect(() => {
    if (existingApiKey) {
      setApiKey(existingApiKey);
    }
  }, [existingApiKey]);

  const handleSave = async () => {
    try {
      await saveModelApiKey(model.model_id, model.model_name, apiKey, isEnabled);
      toast({
        title: "API Key Saved",
        description: `API key for ${model.model_name} has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error Saving API Key",
        description: error instanceof Error ? error.message : "An error occurred while saving the API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2 p-4 rounded-lg bg-muted/50" data-testid={`api-key-item-${model.model_id}`}>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <label htmlFor={model.model_id} className="text-sm font-medium text-foreground">
            {model.model_name}
          </label>
          <p className="text-xs text-muted-foreground">
            Provider: {model.provider}
            {model.version && ` • Version: ${model.version}`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibility}
          className="text-muted-foreground hover:text-foreground"
          data-testid={`toggle-visibility-${model.model_id}`}
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex gap-2">
        <Input
          id={model.model_id}
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter ${model.model_name} API key`}
          className="flex-1 bg-background text-foreground"
          data-testid={`api-key-input-${model.model_id}`}
        />
        <Button
          onClick={handleSave}
          className="gap-2"
          data-testid={`save-key-${model.model_id}`}
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
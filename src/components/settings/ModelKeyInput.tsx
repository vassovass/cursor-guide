import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save } from 'lucide-react';
import { AiModel } from '@/types/ai-models';

interface ModelKeyInputProps {
  model: AiModel;
  showKey: boolean;
  onToggleVisibility: () => void;
  onSave: (modelId: string, modelName: string, isEnabled: boolean) => void;
}

export function ModelKeyInput({ model, showKey, onToggleVisibility, onSave }: ModelKeyInputProps) {
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
          placeholder={`Enter ${model.model_name} API key`}
          className="flex-1 bg-background text-foreground"
          data-testid={`api-key-input-${model.model_id}`}
        />
        <Button
          onClick={() => onSave(model.model_id, model.model_name, true)}
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
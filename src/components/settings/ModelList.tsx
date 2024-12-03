import { AiModel } from '@/types/ai-models';
import { ModelKeyInput } from './ModelKeyInput';

interface ModelListProps {
  models: AiModel[];
  provider: string;
  showKeys: Record<string, boolean>;
  onToggleVisibility: (id: string) => void;
  userConfigs?: any[];
}

export function ModelList({ 
  models, 
  provider, 
  showKeys, 
  onToggleVisibility,
  userConfigs 
}: ModelListProps) {
  if (!models || models.length === 0) {
    return (
      <div className="text-muted-foreground">
        No models available for {provider}. Try syncing to fetch the latest models.
      </div>
    );
  }

  // We only need one API key per provider
  const firstModel = models[0];
  const existingConfig = userConfigs?.find(
    config => config.model_id === firstModel.model_id
  );

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <ModelKeyInput
        key={firstModel.model_id}
        model={firstModel}
        showKey={showKeys[firstModel.id]}
        onToggleVisibility={() => onToggleVisibility(firstModel.id)}
        existingApiKey={existingConfig?.api_key}
        isEnabled={existingConfig?.is_enabled ?? true}
      />
    </div>
  );
}
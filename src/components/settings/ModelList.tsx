import { AiModel } from '@/types/ai-models';
import { ModelKeyInput } from './ModelKeyInput';
import { TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ModelListProps {
  models: AiModel[];
  capability: string;
  showKeys: Record<string, boolean>;
  onToggleVisibility: (id: string) => void;
  userConfigs?: any[];
}

export function ModelList({ 
  models, 
  capability, 
  showKeys, 
  onToggleVisibility,
  userConfigs 
}: ModelListProps) {
  if (!models || models.length === 0) {
    return (
      <TabsContent value={capability}>
        <Alert>
          <AlertDescription>
            No models available for {capability}. Try syncing to fetch the latest models.
          </AlertDescription>
        </Alert>
      </TabsContent>
    );
  }

  return (
    <TabsContent value={capability} className="space-y-4">
      {models.map((model) => {
        const existingConfig = userConfigs?.find(
          config => config.model_id === model.model_id
        );
        return (
          <ModelKeyInput
            key={model.model_id}
            model={model}
            showKey={showKeys[model.id]}
            onToggleVisibility={() => onToggleVisibility(model.id)}
            existingApiKey={existingConfig?.api_key}
            isEnabled={existingConfig?.is_enabled ?? true}
          />
        );
      })}
    </TabsContent>
  );
}
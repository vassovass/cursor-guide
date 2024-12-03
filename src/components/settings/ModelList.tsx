import { AiModel } from '@/types/ai-models';
import { ModelKeyInput } from './ModelKeyInput';
import { TabsContent } from '@/components/ui/tabs';

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
  return (
    <TabsContent key={capability} value={capability} className="space-y-4">
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
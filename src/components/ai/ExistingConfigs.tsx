import { ApiKeyCard } from "./ApiKeyCard";
import type { ApiKeyConfig } from "@/types/api-config";

interface ExistingConfigsProps {
  configs: ApiKeyConfig[];
  onConfigDelete: (id: string) => Promise<void>;
  onConfigUpdate: () => Promise<void>;
}

export function ExistingConfigs({ configs, onConfigDelete, onConfigUpdate }: ExistingConfigsProps) {
  if (configs.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">Configured API Keys</h3>
      <div className="grid gap-4">
        {configs.map((config) => (
          <ApiKeyCard
            key={config.id}
            config={config}
            onDelete={onConfigDelete}
            onUpdate={onConfigUpdate}
          />
        ))}
      </div>
    </div>
  );
}
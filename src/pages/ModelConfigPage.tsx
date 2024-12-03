import { ApiKeyManager } from '@/components/settings/ApiKeyManager';

export function ModelConfigPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Model Configuration</h1>
      <ApiKeyManager />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface ModelConfigHeaderProps {
  onSync: () => void;
  isSyncing: boolean;
}

export function ModelConfigHeader({ onSync, isSyncing }: ModelConfigHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">AI Provider Configuration</h2>
        <p className="text-muted-foreground">
          Configure your AI provider API keys
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onSync}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Providers
          </>
        )}
      </Button>
    </div>
  );
}
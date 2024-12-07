import { SpecificationInput } from "@/components/specification/SpecificationInput";
import { CursorIntegrationGuide } from "@/components/cursor/CursorIntegrationGuide";
import { ApiKeyManager } from "@/components/api/ApiKeyManager";
import { ModelConfigManager } from "@/components/ai/ModelConfigManager";
import { RoadmapMenu } from "@/components/layout/RoadmapMenu";
import { LogViewer } from "@/components/debug/LogViewer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function IndexPage() {
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  console.log("[IndexPage] Rendering with debug logs:", showDebugLogs);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between mb-4">
        <RoadmapMenu />
        <Button 
          variant="outline" 
          onClick={() => {
            console.log("[IndexPage] Toggling debug logs");
            setShowDebugLogs(!showDebugLogs);
          }}
        >
          {showDebugLogs ? "Hide Debug Logs" : "Show Debug Logs"}
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">CursorGuide</h1>
      <p className="text-center text-muted-foreground mb-8">
        Enter your project specifications below and let our AI assist you in structuring and analyzing them.
      </p>
      <div className="grid gap-8">
        <ModelConfigManager />
        <ApiKeyManager />
        <SpecificationInput />
        <CursorIntegrationGuide />
      </div>
      <LogViewer isOpen={showDebugLogs} onClose={() => setShowDebugLogs(false)} />
    </div>
  );
}
import { SpecificationInput } from "@/components/specification/SpecificationInput";
import { CursorIntegrationGuide } from "@/components/cursor/CursorIntegrationGuide";
import { ApiKeyManager } from "@/components/api/ApiKeyManager";
import { ModelConfigManager } from "@/components/ai/ModelConfigManager";
import { RoadmapMenu } from "@/components/layout/RoadmapMenu";

export default function IndexPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end mb-4">
        <RoadmapMenu />
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
    </div>
  );
}
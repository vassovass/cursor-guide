import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModelConfigPage() {
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Model Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI Model Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Configure and customize your AI model settings.</p>
        </CardContent>
      </Card>
    </div>
  );
}
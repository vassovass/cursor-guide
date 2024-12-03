import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DocumentationPage() {
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Documentation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cursor.ai Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Comprehensive documentation for using Cursor.ai effectively.</p>
        </CardContent>
      </Card>
    </div>
  );
}
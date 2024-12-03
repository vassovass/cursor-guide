import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BestPracticesPage() {
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Best Practices</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cursor.ai Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Learn about the recommended practices for using Cursor.ai effectively.</p>
        </CardContent>
      </Card>
    </div>
  );
}
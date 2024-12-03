import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupPage() {
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Setup Guide</h1>
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Cursor.ai</CardTitle>
          <CardDescription>Follow these steps to set up your development environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Install Cursor.ai</h3>
            <p>Download and install Cursor.ai from the official website.</p>
            
            <h3 className="text-lg font-semibold">2. Configure Your Environment</h3>
            <p>Set up your development environment with the recommended settings.</p>
            
            <h3 className="text-lg font-semibold">3. Project Structure</h3>
            <p>Learn about the recommended project structure for optimal AI assistance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SetupPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to CursorGuide</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p>Before you begin, you'll need to configure your API keys for the AI providers you want to use.</p>
            
            <Button 
              onClick={() => navigate('/api-keys')}
              className="w-full"
            >
              Configure API Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
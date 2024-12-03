import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Welcome to CursorGuide</h1>
      <p className="text-xl text-gray-600 mb-8">
        Your companion for building better desktop applications with Cursor.ai.
        Follow our guide to implement best practices and create robust
        applications.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
          <p className="text-gray-600 mb-4">
            Get up and running with Cursor.ai in minutes. Learn the basics and
            start your first project.
          </p>
          <Button className="gap-2">
            Start Tutorial
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
          <p className="text-gray-600 mb-4">
            Learn how to structure your projects and follow best practices for
            optimal results.
          </p>
          <Button variant="outline" className="gap-2">
            View Guide
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 fixed top-0 right-0 left-64 bg-white z-10">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search documentation..."
            className="w-64 px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Github className="w-4 h-4" />
          Star on GitHub
        </Button>
      </div>
    </header>
  );
}
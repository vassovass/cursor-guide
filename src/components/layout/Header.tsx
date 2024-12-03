import { Button } from "@/components/ui/button";
import { Github, Menu, ToggleRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";

export function Header() {
  const [devMode, setDevMode] = useState(() => {
    const saved = localStorage.getItem("devMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("devMode", JSON.stringify(devMode));
    // Add or remove a class to the document body for global styling
    if (devMode) {
      document.body.classList.add("dev-mode");
    } else {
      document.body.classList.remove("dev-mode");
    }
  }, [devMode]);

  return (
    <header className="h-16 border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 bg-white z-10">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <input
            type="search"
            placeholder="Search documentation..."
            className="w-64 px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-4">
          <Toggle
            pressed={devMode}
            onPressedChange={setDevMode}
            aria-label="Toggle developer mode"
            className="gap-2"
          >
            <ToggleRight className="h-4 w-4" />
            <span className="hidden sm:inline">Developer Mode</span>
          </Toggle>
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="w-4 h-4" />
            Star on GitHub
          </Button>
        </div>
      </div>
    </header>
  );
}
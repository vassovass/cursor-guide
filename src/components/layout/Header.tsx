import { Button } from "@/components/ui/button";
import { Github, Menu, Moon, Sun, ToggleRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { RoadmapMenu } from "./RoadmapMenu";

export function Header() {
  const [debugMode, setDebugMode] = useState(() => {
    const saved = localStorage.getItem("debugMode");
    return saved ? JSON.parse(saved) : false;
  });

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem("debugMode", JSON.stringify(debugMode));
    if (debugMode) {
      document.body.classList.add("debug-mode");
    } else {
      document.body.classList.remove("debug-mode");
    }
  }, [debugMode]);

  return (
    <header className="h-16 border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 bg-background z-10">
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
              <Sidebar debugMode={debugMode} />
            </SheetContent>
          </Sheet>
          <input
            type="search"
            placeholder="Search documentation..."
            className="w-64 px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {debugMode && <RoadmapMenu />}
        </div>
        <div className="flex items-center gap-4">
          <Toggle
            pressed={debugMode}
            onPressedChange={setDebugMode}
            aria-label="Toggle debug/developer mode"
            title="Debug/Developer Mode"
            className="relative group"
          >
            <ToggleRight className={`h-4 w-4 transition-colors ${debugMode ? 'text-primary' : ''}`} />
            <span className="sr-only">Debug Mode</span>
            <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -bottom-8 whitespace-nowrap">
              Debug/Developer Mode
            </span>
          </Toggle>
          <Toggle
            pressed={theme === "dark"}
            onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="gap-2"
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
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
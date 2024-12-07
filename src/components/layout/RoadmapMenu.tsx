import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useState } from "react";
import { LogViewer } from "@/components/debug/LogViewer";
import { Toggle } from "@/components/ui/toggle";
import { Bug } from "lucide-react";

export function RoadmapMenu() {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <>
      <Menubar 
        className="border-none bg-transparent"
        data-testid="roadmap-navigation-menu"
      >
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              data-testid="roadmap-menu-trigger"
            >
              <Bug className="w-4 h-4" />
              Logs
            </Button>
          </MenubarTrigger>
          <MenubarContent 
            className="bg-background border border-border shadow-md"
            data-testid="roadmap-menu-content"
          >
            <MenubarItem asChild>
              <Toggle
                pressed={showLogs}
                onPressedChange={setShowLogs}
                className="w-full justify-start"
                data-testid="roadmap-menu-logs-toggle"
              >
                View Logs
              </Toggle>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <LogViewer 
        isOpen={showLogs} 
        onClose={() => setShowLogs(false)} 
      />
    </>
  );
}
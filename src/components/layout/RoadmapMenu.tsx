import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogViewer } from "@/components/debug/LogViewer";
import { Toggle } from "@/components/ui/toggle";

export function RoadmapMenu() {
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = useState(false);

  return (
    <>
      <Menubar className="border-none bg-transparent">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Activity className="w-4 h-4" />
              Development
            </Button>
          </MenubarTrigger>
          <MenubarContent className="bg-popover border border-border shadow-md backdrop-blur-none">
            <MenubarItem onClick={() => navigate("/roadmap")}>
              Full Roadmap
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => navigate("/roadmap/sprint-1")}>
              Sprint 1: Foundation
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/roadmap/sprint-2")}>
              Sprint 2: Documentation
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/roadmap/sprint-3")}>
              Sprint 3: Setup
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/roadmap/sprint-4")}>
              Sprint 4: AI Configuration
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/roadmap/sprint-5")}>
              Sprint 5: Launch
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem asChild>
              <Toggle
                pressed={showLogs}
                onPressedChange={setShowLogs}
                className="w-full justify-start"
              >
                View Logs
              </Toggle>
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/metrics")}>
              Development Metrics
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <LogViewer isOpen={showLogs} onClose={() => setShowLogs(false)} />
    </>
  );
}
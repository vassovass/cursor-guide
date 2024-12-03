import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RoadmapMenu() {
  const navigate = useNavigate();

  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <FileText className="w-4 h-4" />
            Roadmap
          </Button>
        </MenubarTrigger>
        <MenubarContent>
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
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
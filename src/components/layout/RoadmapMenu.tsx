import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SprintMenuItem {
  id: number;
  path: string;
  title: string;
  testId: string;
}

const SPRINT_MENU_ITEMS: SprintMenuItem[] = [
  {
    id: 1,
    path: "/roadmap/sprint-1",
    title: "Sprint 1: Specification Processor",
    testId: "sprint-menu-item-foundation",
  },
  {
    id: 2,
    path: "/roadmap/sprint-2",
    title: "Sprint 2: Cursor.ai Integration Guide",
    testId: "sprint-menu-item-documentation",
  },
  {
    id: 3,
    path: "/roadmap/sprint-3",
    title: "Sprint 3: Implementation Assistant",
    testId: "sprint-menu-item-setup",
  },
  {
    id: 4,
    path: "/roadmap/sprint-4",
    title: "Sprint 4: Quality Assurance",
    testId: "sprint-menu-item-ai-config",
  },
  {
    id: 5,
    path: "/roadmap/sprint-5",
    title: "Sprint 5: Documentation & Launch",
    testId: "sprint-menu-item-launch",
  },
];

export function RoadmapMenu() {
  const navigate = useNavigate();

  const handleSprintNavigation = (path: string) => {
    navigate(path);
  };

  return (
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
            <Activity className="w-4 h-4" />
            Project Roadmap
          </Button>
        </MenubarTrigger>
        <MenubarContent 
          className="bg-background border border-border shadow-md"
          data-testid="roadmap-menu-content"
        >
          <MenubarItem 
            onClick={() => handleSprintNavigation("/roadmap")}
            data-testid="roadmap-menu-item-overview"
          >
            Project Overview
          </MenubarItem>
          
          {SPRINT_MENU_ITEMS.map((sprint) => (
            <MenubarItem
              key={sprint.id}
              onClick={() => handleSprintNavigation(sprint.path)}
              data-testid={sprint.testId}
              className="roadmap-sprint-item"
            >
              {sprint.title}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
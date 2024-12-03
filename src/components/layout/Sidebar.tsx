import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  debugMode?: boolean;
}

export function Sidebar({ debugMode = false }: SidebarProps) {
  const routes = [
    { path: '/', label: 'Setup' },
    { path: '/docs', label: 'Documentation' },
    { path: '/best-practices', label: 'Best Practices' },
    { path: '/model-config', label: 'Model Configuration' },
    ...(debugMode ? [
      { path: '/roadmap/sprint-1', label: 'Sprint 1: Foundation' },
      { path: '/roadmap/sprint-2', label: 'Sprint 2: Documentation' },
      { path: '/roadmap/sprint-3', label: 'Sprint 3: Setup' },
      { path: '/roadmap/sprint-4', label: 'Sprint 4: AI Configuration' },
      { path: '/roadmap/sprint-5', label: 'Sprint 5: Launch' },
    ] : []),
  ];

  return (
    <div className="hidden lg:block w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-[calc(100vh-3.5rem)] py-6">
        <div className="space-y-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {route.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
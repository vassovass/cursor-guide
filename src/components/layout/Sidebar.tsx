import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  debugMode?: boolean;
  onClose?: () => void;
}

export function Sidebar({ debugMode = false, onClose }: SidebarProps) {
  const routes = [
    { path: '/', label: 'Setup' },
    { path: '/docs', label: 'Documentation' },
    { path: '/best-practices', label: 'Best Practices' },
    { path: '/model-config', label: 'Model Configuration' },
  ];

  return (
    <div className="w-64 h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center p-4 lg:hidden">
        <h2 className="font-semibold">Navigation</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {routes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  onClick={onClose}
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
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogEntry } from "./LogEntry";
import type { Log } from "./types";

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogViewer({ isOpen, onClose }: LogViewerProps) {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLogs([{
        level: 'INFO',
        message: 'Starting debug session...',
        timestamp: new Date().toISOString()
      }]);
    } else {
      setLogs([]);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Debug Logs</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          <div className="space-y-1 font-mono text-sm">
            {logs.map((log, index) => (
              <LogEntry key={index} log={log} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
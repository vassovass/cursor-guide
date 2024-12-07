import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LogEntry } from "./LogEntry";
import type { Log } from "./types";

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogViewer({ isOpen, onClose }: LogViewerProps) {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = useCallback((newLog: Log) => {
    setLogs(prev => [...prev, newLog]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Console logging override
  useEffect(() => {
    if (!isOpen) return;

    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    const originalConsoleDebug = console.debug;

    // Helper to create log entries
    const createLogEntry = (level: Log['level'], args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');

      const log: Log = {
        level,
        message,
        timestamp: new Date().toISOString(),
        source: 'console',
        details: args.length === 1 && typeof args[0] === 'object' ? args[0] : undefined
      };

      if (level === 'ERROR' && args[0] instanceof Error) {
        log.stack = args[0].stack;
      }

      addLog(log);
    };

    // Override console methods
    console.log = (...args) => {
      originalConsoleLog.apply(console, args);
      createLogEntry('INFO', args);
    };

    console.warn = (...args) => {
      originalConsoleWarn.apply(console, args);
      createLogEntry('WARN', args);
    };

    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      createLogEntry('ERROR', args);
    };

    console.debug = (...args) => {
      originalConsoleDebug.apply(console, args);
      createLogEntry('DEBUG', args);
    };

    // Add initial log
    addLog({
      level: 'INFO',
      message: 'Debug session started',
      timestamp: new Date().toISOString(),
      source: 'system'
    });

    // Capture unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      addLog({
        level: 'ERROR',
        message: event.message,
        timestamp: new Date().toISOString(),
        source: 'window',
        stack: event.error?.stack,
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    };

    // Capture unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      addLog({
        level: 'ERROR',
        message: event.reason?.message || 'Unhandled Promise rejection',
        timestamp: new Date().toISOString(),
        source: 'promise',
        stack: event.reason?.stack,
        details: event.reason
      });
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    // Cleanup function
    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      console.debug = originalConsoleDebug;
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, [isOpen, addLog]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Debug Logs</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearLogs}
            title="Clear logs"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          <div className="space-y-1">
            {logs.map((log, index) => (
              <LogEntry key={index} log={log} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
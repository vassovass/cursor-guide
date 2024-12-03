import React from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Draggable from 'react-draggable';

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogViewer({ isOpen, onClose }: LogViewerProps) {
  if (!isOpen) return null;

  return (
    <Draggable handle=".drag-handle" bounds="body">
      <div className="fixed bottom-16 right-6 w-96 h-96 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-border drag-handle cursor-move">
          <h3 className="font-semibold">Debug Logs</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-sm"
            aria-label="Close logs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)] p-4">
          <div className="space-y-2 font-mono text-sm">
            <div className="text-muted-foreground">
              [INFO] Application initialized
            </div>
            <div className="text-yellow-500">
              [WARN] No routes matched location "/logs"
            </div>
            <div className="text-red-500">
              [ERROR] Failed to load resource
            </div>
          </div>
        </ScrollArea>
      </div>
    </Draggable>
  );
}
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Draggable from 'react-draggable';
import { supabase } from '@/integrations/supabase/client';

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
}

export function LogViewer({ isOpen, onClose }: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      level: 'INFO',
      message: 'Application initialized',
      timestamp: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    const testAiSuite = async () => {
      try {
        console.log('Starting AI Suite test');
        setLogs(prev => [...prev, {
          level: 'INFO',
          message: 'Starting AI Suite connection test...',
          timestamp: new Date().toISOString()
        }]);

        const { data, error } = await supabase.functions.invoke('ai-suite-process', {
          body: { action: 'test' }
        });

        console.log('AI Suite test response:', data);

        if (error) {
          console.error('AI Suite test error:', error);
          throw error;
        }

        setLogs(prev => [...prev, {
          level: 'INFO',
          message: 'AI Suite connection test completed successfully',
          timestamp: new Date().toISOString()
        }]);

        // Add detailed test results
        if (data?.details) {
          Object.entries(data.details).forEach(([key, value]) => {
            setLogs(prev => [...prev, {
              level: 'INFO',
              message: `AI Suite ${key}: ${value}`,
              timestamp: new Date().toISOString()
            }]);
          });
        }
      } catch (error) {
        console.error('AI Suite test error:', error);
        setLogs(prev => [...prev, {
          level: 'ERROR',
          message: `AI Suite test failed: ${error.message}`,
          timestamp: new Date().toISOString()
        }]);
      }
    };

    if (isOpen) {
      testAiSuite();
    }
  }, [isOpen]);

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
            {logs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.level === 'ERROR' ? 'text-red-500' :
                  log.level === 'WARN' ? 'text-yellow-500' :
                  'text-muted-foreground'
                }`}
              >
                [{log.level}] {log.message}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Draggable>
  );
}
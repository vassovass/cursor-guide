import { Log } from "./types";

export function LogEntry({ log }: { log: Log }) {
  return (
    <div className="py-1 font-mono">
      <div className="flex items-start gap-2">
        <span className="text-muted-foreground text-xs">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
        <span className={`${
          log.level === 'ERROR' ? 'text-red-500' :
          log.level === 'WARN' ? 'text-yellow-500' :
          log.level === 'DEBUG' ? 'text-blue-500' :
          'text-foreground'
        }`}>
          [{log.level}] {log.source && `[${log.source}]`} {log.message}
        </span>
      </div>
      {log.details && (
        <pre className="text-xs text-muted-foreground ml-20 mt-1 whitespace-pre-wrap">
          {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
        </pre>
      )}
      {log.stack && (
        <pre className="text-xs text-red-400 ml-20 mt-1 whitespace-pre-wrap">
          {log.stack}
        </pre>
      )}
    </div>
  );
}
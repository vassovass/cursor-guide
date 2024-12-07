import { Log } from "./types";

export function LogEntry({ log }: { log: Log }) {
  return (
    <div className="py-1">
      <span className="text-muted-foreground text-sm">
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
      <span className={`ml-2 ${
        log.level === 'ERROR' ? 'text-red-500' :
        log.level === 'WARN' ? 'text-yellow-500' :
        'text-foreground'
      }`}>
        [{log.level}] {log.message}
      </span>
    </div>
  );
}
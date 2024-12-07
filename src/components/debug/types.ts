export interface Log {
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  timestamp: string;
  source?: string;
  details?: any;
  stack?: string;
}
export interface Log {
  level: 'ERROR' | 'WARN' | 'INFO';
  message: string;
  timestamp: string;
}
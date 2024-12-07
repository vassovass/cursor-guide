export interface Log {
  level: 'ERROR' | 'WARN' | 'INFO';
  message: string;
  timestamp: string;
}

export interface AIModel {
  model_name: string;
  model_id: string;
  provider: string;
}
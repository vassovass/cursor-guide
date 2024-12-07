export interface ApiKeyConfig {
  id: string;
  provider: string;
  api_key: string;
  last_verified_at: string;
  notes?: string | null;
}
import { Json } from '@/integrations/supabase/types';

export interface AiModelCapabilities {
  tasks: string[];
  features: string[];
}

export interface AiModel {
  id: string;
  model_id: string;
  model_name: string;
  provider: string;
  is_available: boolean;
  version: string | null;
  capabilities: AiModelCapabilities;
}

export interface ApiKey {
  id: string;
  model_name: string;
  model_id: string;
  is_enabled: boolean;
}

export interface GroupedModels {
  [key: string]: AiModel[];
}

export interface SupabaseAiModel {
  id: string;
  model_id: string;
  model_name: string;
  provider: string;
  is_available: boolean;
  version: string | null;
  capabilities: Json;
  created_at: string;
  updated_at: string;
}

export const CAPABILITY_LABELS: Record<string, string> = {
  'text-generation': 'Text Generation',
  'image-generation': 'Image Generation',
  'audio-transcription': 'Audio Processing',
  'multimodal': 'Multimodal',
  'reasoning': 'Reasoning & Analysis',
  'vision': 'Computer Vision',
};
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      project_specifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          content: string
          status: string | null
          parsed_data: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          content: string
          status?: string | null
          parsed_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          content?: string
          status?: string | null
          parsed_data?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_model_preferences: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          model_id: string
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          model_id: string
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          model_id?: string
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          date: string;
          location_name: string | null;
          latitude: number | null;
          longitude: number | null;
          activity: string | null;
          mood: string | null;
          tags?: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          date?: string;
          location_name?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          activity?: string | null;
          mood?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          location_name?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          activity?: string | null;
          mood?: string | null;
          tags?: string[] | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      photos: {
        Row: {
          id: string;
          memory_id: string | null;
          user_id: string;
          storage_path: string;
          image_url: string;
          original_filename: string | null;
          captured_at: string | null;
          latitude: number | null;
          longitude: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          memory_id?: string | null;
          user_id: string;
          storage_path: string;
          image_url: string;
          original_filename?: string | null;
          captured_at?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          memory_id?: string | null;
          user_id?: string;
          storage_path?: string;
          image_url?: string;
          original_filename?: string | null;
          captured_at?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photos_memory_id_fkey";
            columns: ["memory_id"];
            isOneToOne: false;
            referencedRelation: "memories";
            referencedColumns: ["id"];
          }
        ];
      };
      people: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      memory_people: {
        Row: {
          memory_id: string;
          person_id: string;
        };
        Insert: {
          memory_id: string;
          person_id: string;
        };
        Update: {
          memory_id?: string;
          person_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memory_people_memory_id_fkey";
            columns: ["memory_id"];
            isOneToOne: false;
            referencedRelation: "memories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memory_people_person_id_fkey";
            columns: ["person_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          }
        ];
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

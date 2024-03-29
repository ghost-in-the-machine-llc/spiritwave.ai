export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      healer: {
        Row: {
          avatar: string | null
          content: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          avatar?: string | null
          content: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          avatar?: string | null
          content?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      moment: {
        Row: {
          created_at: string
          id: number
          messages: Json
          response: string
          session_id: number
          step_id: number
          uid: string
        }
        Insert: {
          created_at?: string
          id?: number
          messages: Json
          response: string
          session_id: number
          step_id: number
          uid: string
        }
        Update: {
          created_at?: string
          id?: number
          messages?: Json
          response?: string
          session_id?: number
          step_id?: number
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "moment_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moment_step_id_fkey"
            columns: ["step_id"]
            referencedRelation: "step"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moment_uid_fkey"
            columns: ["uid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      service: {
        Row: {
          content: string | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      session: {
        Row: {
          created_at: string
          healer_id: number
          id: number
          service_id: number
          status: Database["public"]["Enums"]["session_status"]
          step_id: number | null
          uid: string
        }
        Insert: {
          created_at?: string
          healer_id?: number
          id?: number
          service_id?: number
          status?: Database["public"]["Enums"]["session_status"]
          step_id?: number | null
          uid?: string
        }
        Update: {
          created_at?: string
          healer_id?: number
          id?: number
          service_id?: number
          status?: Database["public"]["Enums"]["session_status"]
          step_id?: number | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_healer_id_fkey"
            columns: ["healer_id"]
            referencedRelation: "healer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_step_id_fkey"
            columns: ["step_id"]
            referencedRelation: "step"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_uid_fkey"
            columns: ["uid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      step: {
        Row: {
          content: string | null
          created_at: string
          id: number
          name: string | null
          prior_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          name?: string | null
          prior_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          name?: string | null
          prior_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "step_prior_id_fkey"
            columns: ["prior_id"]
            referencedRelation: "step"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      restored_session: {
        Row: {
          responses: string | null
          session_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "moment_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "session"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      session_status: "created" | "active" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


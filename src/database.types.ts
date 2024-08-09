export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      collections: {
        Row: {
          createdat: string
          email: string
          folder: string
          id: number
          name: string
          status: Database["public"]["Enums"]["collection_status"]
          user_id: string
        }
        Insert: {
          createdat?: string
          email: string
          folder: string
          id?: number
          name: string
          status: Database["public"]["Enums"]["collection_status"]
          user_id: string
        }
        Update: {
          createdat?: string
          email?: string
          folder?: string
          id?: number
          name?: string
          status?: Database["public"]["Enums"]["collection_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: number
          stripe_customer_id: string
          stripe_subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          stripe_customer_id: string
          stripe_subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          stripe_customer_id?: string
          stripe_subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          adobe_stock_category: number | null
          collection_id: number
          description: string
          file_name: string
          id: number
          title: string
          user_id: string
        }
        Insert: {
          adobe_stock_category?: number | null
          collection_id: number
          description: string
          file_name: string
          id?: number
          title: string
          user_id: string
        }
        Update: {
          adobe_stock_category?: number | null
          collection_id?: number
          description?: string
          file_name?: string
          id?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          created_at: string
          id: number
          image_id: number
          keyword: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_id: number
          keyword: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          image_id?: number
          keyword?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "keywords_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keywords_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      runs: {
        Row: {
          collection_id: number
          created_at: string
          file_name: string
          id: number
          rerun_attempt: number | null
          run_id: string
          status: string | null
        }
        Insert: {
          collection_id: number
          created_at?: string
          file_name: string
          id?: number
          rerun_attempt?: number | null
          run_id: string
          status?: string | null
        }
        Update: {
          collection_id?: number
          created_at?: string
          file_name?: string
          id?: number
          rerun_attempt?: number | null
          run_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "runs_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_runs_in_collection: {
        Args: {
          p_collection_id: number
        }
        Returns: {
          collection_id: number
          file_name: string
          id: number
          run_id: string
          status: string
          rerun_attempt: number
          created_at: string
        }[]
      }
      get_latest_runs_with_window_function: {
        Args: {
          p_collection_id: number
        }
        Returns: {
          collection_id: number
          file_name: string
          id: number
          run_id: string
          status: string
          rerun_attempt: number
          created_at: string
        }[]
      }
    }
    Enums: {
      collection_status: "completed" | "failed" | "pending"
      subscription_status:
        | "INCOMPLETE"
        | "INCOMPLETE_EXPIRED"
        | "TRAILING"
        | "ACTIVE"
        | "PAST_DUE"
        | "CANCELED"
        | "UNPAID"
        | "PAUSED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

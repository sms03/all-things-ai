export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          tool_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          tool_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          tool_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          tool_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string
          dish_id: string | null
          dish_name: string
          estimated_price: number | null
          has_special_requests: boolean | null
          id: string
          inquiry_type: string | null
          quantity: number
          serving_size: string | null
          special_requests: string | null
          status: string | null
          updated_at: string
          user_email: string
          user_id: string
          user_name: string
          user_phone: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          dish_id?: string | null
          dish_name: string
          estimated_price?: number | null
          has_special_requests?: boolean | null
          id?: string
          inquiry_type?: string | null
          quantity?: number
          serving_size?: string | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string
          user_email: string
          user_id: string
          user_name: string
          user_phone?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          dish_id?: string | null
          dish_name?: string
          estimated_price?: number | null
          has_special_requests?: boolean | null
          id?: string
          inquiry_type?: string | null
          quantity?: number
          serving_size?: string | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string
          user_email?: string
          user_id?: string
          user_name?: string
          user_phone?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_idea_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      project_idea_upvotes: {
        Row: {
          created_at: string
          id: string
          project_idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_idea_upvotes_project_idea_id_fkey"
            columns: ["project_idea_id"]
            isOneToOne: false
            referencedRelation: "project_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      project_ideas: {
        Row: {
          ai_tools_used: string[]
          business_potential: string
          category: string
          created_at: string
          created_by: string | null
          description: string
          detailed_description: string | null
          difficulty_level: string
          estimated_time: string
          featured: boolean | null
          id: string
          learning_resources: string[] | null
          market_size: string | null
          monetization_ideas: string[] | null
          required_skills: string[]
          similar_successful_companies: string[] | null
          tags: string[] | null
          target_audience: string | null
          tech_stack: string[]
          title: string
          trending: boolean | null
          updated_at: string
          upvotes_count: number | null
          views_count: number | null
        }
        Insert: {
          ai_tools_used?: string[]
          business_potential: string
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          detailed_description?: string | null
          difficulty_level: string
          estimated_time: string
          featured?: boolean | null
          id?: string
          learning_resources?: string[] | null
          market_size?: string | null
          monetization_ideas?: string[] | null
          required_skills?: string[]
          similar_successful_companies?: string[] | null
          tags?: string[] | null
          target_audience?: string | null
          tech_stack?: string[]
          title: string
          trending?: boolean | null
          updated_at?: string
          upvotes_count?: number | null
          views_count?: number | null
        }
        Update: {
          ai_tools_used?: string[]
          business_potential?: string
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          detailed_description?: string | null
          difficulty_level?: string
          estimated_time?: string
          featured?: boolean | null
          id?: string
          learning_resources?: string[] | null
          market_size?: string | null
          monetization_ideas?: string[] | null
          required_skills?: string[]
          similar_successful_companies?: string[] | null
          tags?: string[] | null
          target_audience?: string | null
          tech_stack?: string[]
          title?: string
          trending?: boolean | null
          updated_at?: string
          upvotes_count?: number | null
          views_count?: number | null
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          created_at: string
          id: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          helpful_count: number | null
          id: string
          rating: number
          title: string | null
          tool_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating: number
          title?: string | null
          tool_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating?: number
          title?: string | null
          tool_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          clicked_tool_id: string | null
          created_at: string
          filters: Json | null
          id: string
          query: string
          results_count: number | null
          user_id: string | null
        }
        Insert: {
          clicked_tool_id?: string | null
          created_at?: string
          filters?: Json | null
          id?: string
          query: string
          results_count?: number | null
          user_id?: string | null
        }
        Update: {
          clicked_tool_id?: string | null
          created_at?: string
          filters?: Json | null
          id?: string
          query?: string
          results_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_clicked_tool_id_fkey"
            columns: ["clicked_tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_analytics: {
        Row: {
          bookmarks_count: number | null
          clicks_count: number | null
          created_at: string
          date: string
          id: string
          searches_count: number | null
          tool_id: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          bookmarks_count?: number | null
          clicks_count?: number | null
          created_at?: string
          date?: string
          id?: string
          searches_count?: number | null
          tool_id: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          bookmarks_count?: number | null
          clicks_count?: number | null
          created_at?: string
          date?: string
          id?: string
          searches_count?: number | null
          tool_id?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_analytics_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_comparisons: {
        Row: {
          created_at: string
          id: string
          name: string
          tool_ids: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          tool_ids: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tool_ids?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tool_moderation: {
        Row: {
          created_at: string
          id: string
          moderated_at: string
          moderator_id: string | null
          notes: string | null
          previous_status: Database["public"]["Enums"]["tool_status"] | null
          status: Database["public"]["Enums"]["tool_status"]
          tool_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          moderated_at?: string
          moderator_id?: string | null
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["tool_status"] | null
          status?: Database["public"]["Enums"]["tool_status"]
          tool_id: string
        }
        Update: {
          created_at?: string
          id?: string
          moderated_at?: string
          moderator_id?: string | null
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["tool_status"] | null
          status?: Database["public"]["Enums"]["tool_status"]
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_moderation_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          category_id: string
          created_at: string
          description: string
          featured: boolean | null
          id: string
          last_checked: string | null
          name: string
          pricing: string
          rating: number | null
          status: Database["public"]["Enums"]["tool_status"]
          submitted_by: string | null
          tags: string[] | null
          trending: boolean | null
          updated_at: string
          website: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          featured?: boolean | null
          id?: string
          last_checked?: string | null
          name: string
          pricing: string
          rating?: number | null
          status?: Database["public"]["Enums"]["tool_status"]
          submitted_by?: string | null
          tags?: string[] | null
          trending?: boolean | null
          updated_at?: string
          website: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          featured?: boolean | null
          id?: string
          last_checked?: string | null
          name?: string
          pricing?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["tool_status"]
          submitted_by?: string | null
          tags?: string[] | null
          trending?: boolean | null
          updated_at?: string
          website?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          tool_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          tool_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          tool_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          interaction_score: Json | null
          preferred_categories: string[] | null
          preferred_pricing: string[] | null
          preferred_tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_score?: Json | null
          preferred_categories?: string[] | null
          preferred_pricing?: string[] | null
          preferred_tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_score?: Json | null
          preferred_categories?: string[] | null
          preferred_pricing?: string[] | null
          preferred_tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          _assigned_by: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      get_top_rated_tools: {
        Args: { limit_count?: number }
        Returns: {
          category_id: string
          created_at: string
          description: string
          featured: boolean
          id: string
          name: string
          pricing: string
          rating: number
          status: Database["public"]["Enums"]["tool_status"]
          tags: string[]
          trending: boolean
          updated_at: string
          website: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_daily_tool_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_tool_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      tool_status: "pending" | "approved" | "rejected" | "discontinued"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      tool_status: ["pending", "approved", "rejected", "discontinued"],
    },
  },
} as const

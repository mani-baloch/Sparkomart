export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string;
          cta: string;
          href: string;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description?: string;
          image?: string;
          cta?: string;
          href?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image?: string;
          cta?: string;
          href?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          category_id: string | null;
          price: number;
          old_price: number | null;
          rating: number;
          reviews: number;
          badge: string | null;
          in_stock: boolean;
          shipping: string;
          image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id?: string | null;
          price: number;
          old_price?: number | null;
          rating?: number;
          reviews?: number;
          badge?: string | null;
          in_stock?: boolean;
          shipping?: string;
          image?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string | null;
          price?: number;
          old_price?: number | null;
          rating?: number;
          reviews?: number;
          badge?: string | null;
          in_stock?: boolean;
          shipping?: string;
          image?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          subject: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          subject?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          tracking_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Json;
          items: Json;
          subtotal: number;
          shipping_fee: number;
          total: number;
          payment_method: string;
          payment_status: string;
          order_status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          tracking_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Json;
          items: Json;
          subtotal: number;
          shipping_fee?: number;
          total: number;
          payment_method?: string;
          payment_status?: string;
          order_status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tracking_number?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: Json;
          items?: Json;
          subtotal?: number;
          shipping_fee?: number;
          total?: number;
          payment_method?: string;
          payment_status?: string;
          order_status?: string;
          notes?: string | null;
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
};

export type DbCategory = Database["public"]["Tables"]["categories"]["Row"];
export type DbProduct = Database["public"]["Tables"]["products"]["Row"];
export type DbContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type DbOrder = Database["public"]["Tables"]["orders"]["Row"];

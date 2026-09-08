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

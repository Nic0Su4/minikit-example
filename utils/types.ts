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
      detalles_pedido: {
        Row: {
          cantidad: number
          id: number
          pedido_id: number
          producto_id: number
        }
        Insert: {
          cantidad: number
          id?: never
          pedido_id: number
          producto_id: number
        }
        Update: {
          cantidad?: number
          id?: never
          pedido_id?: number
          producto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "detalles_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_pedido_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          created_at: string | null
          estado: string
          estado_preparacion: string | null
          id: number
          qr_code: string
          qr_estado: string | null
          tienda_id: number
          user_wallet: string | null
        }
        Insert: {
          created_at?: string | null
          estado: string
          estado_preparacion?: string | null
          id?: never
          qr_code: string
          qr_estado?: string | null
          tienda_id: number
          user_wallet?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string
          estado_preparacion?: string | null
          id?: never
          qr_code?: string
          qr_estado?: string | null
          tienda_id?: number
          user_wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_user_wallet_fkey"
            columns: ["user_wallet"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["wallet_address"]
          },
        ]
      }
      productos: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: number
          imagen_url: string | null
          nombre: string
          precio: number
          stock: number | null
          tienda_id: number
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: never
          imagen_url?: string | null
          nombre: string
          precio: number
          stock?: number | null
          tienda_id: number
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: never
          imagen_url?: string | null
          nombre?: string
          precio?: number
          stock?: number | null
          tienda_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "productos_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
      tiendas: {
        Row: {
          created_at: string | null
          direccion: string
          gerente_address: string | null
          id: number
          logo_url: string | null
          nombre: string
          tipo_id: number
        }
        Insert: {
          created_at?: string | null
          direccion: string
          gerente_address?: string | null
          id?: never
          logo_url?: string | null
          nombre: string
          tipo_id: number
        }
        Update: {
          created_at?: string | null
          direccion?: string
          gerente_address?: string | null
          id?: never
          logo_url?: string | null
          nombre?: string
          tipo_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tiendas_gerente_address_fkey"
            columns: ["gerente_address"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "tiendas_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_tiendas: {
        Row: {
          icono: string | null
          id: number
          nombre: string
        }
        Insert: {
          icono?: string | null
          id?: never
          nombre: string
        }
        Update: {
          icono?: string | null
          id?: never
          nombre?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          correo_electronico: string | null
          created_at: string | null
          rol: string
          telefono: string | null
          username: string
          wallet_address: string
        }
        Insert: {
          correo_electronico?: string | null
          created_at?: string | null
          rol: string
          telefono?: string | null
          username: string
          wallet_address: string
        }
        Update: {
          correo_electronico?: string | null
          created_at?: string | null
          rol?: string
          telefono?: string | null
          username?: string
          wallet_address?: string
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

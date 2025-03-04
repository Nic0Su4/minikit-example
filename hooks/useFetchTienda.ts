import { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

type Tienda = {
  created_at: string | null;
  direccion: string;
  gerente_address: string | null;
  id: number;
  logo_url: string | null;
  nombre: string;
  tipo_id: number;
} | null;

export function useFetchTienda() {
  const [tienda, setTienda] = useState<Tienda>();

  const fetchTienda = useCallback(async (walletAddress: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tiendas")
      .select("*")
      .eq("gerente_address", walletAddress)
      .single();

    if (error) {
      console.error("Error al obtener la tienda:", error);
    } else {
      setTienda(data);
    }
  }, []);

  return { tienda, fetchTienda };
}

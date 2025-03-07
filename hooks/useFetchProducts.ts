import { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export function useFetchProducts() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = useCallback(async (storeId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("tienda_id", +storeId);

    if (error) {
      console.error("Error al obtener los productos:", error);
    } else {
      setProducts(data);
    }
  }, []);

  return { products, fetchProducts };
}

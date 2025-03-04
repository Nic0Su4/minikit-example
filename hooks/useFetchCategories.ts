import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useFetchCategories() {
  const [categories, setCategories] = useState<any[]>();

  const fetchCategories = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("tipos_tiendas").select("*");

    if (error) {
      console.error("Error al obtener la tienda:", error);
    } else {
      setCategories(data);
    }
  };

  return { categories, fetchCategories };
}

"use server";

import { createClient } from "@/utils/supabase/server";

export async function createStoreAction(formData: FormData) {
  const supabase = await createClient();

  const data = {
    nombre: formData.get("nombre") as string,
    direccion: formData.get("direccion") as string,
    tipo_id: formData.get("tipo_id") as string,
    logoFile: formData.get("logoFile") as File,
    gerenteId: formData.get("gerenteId") as string,
  };

  let logoUrl: string | null = null;

  if (data.logoFile) {
    const { data: logoData, error } = await supabase.storage
      .from("logos-tiendas")
      .upload(`logos/${data.gerenteId}-${Date.now()}`, data.logoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error("Error al subir el logo: " + error.message);
    }

    logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${logoData?.fullPath}`;
  }

  const { error } = await supabase.from("tiendas").insert({
    nombre: data.nombre,
    direccion: data.direccion,
    tipo_id: +data.tipo_id,
    logo_url: logoUrl,
    gerente_address: data.gerenteId,
  });

  if (error) {
    throw new Error("Error al crear la tienda: " + error.message);
  }
}

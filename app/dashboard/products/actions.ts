"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Obtiene los productos de una tienda específica
 * @param tiendaId El ID de la tienda
 * @returns Lista de productos
 */
export const getProductsByStore = async (tiendaId: number) => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("productos")
    .select("*")
    .eq("tienda_id", tiendaId);

  if (error) {
    throw new Error("Error al obtener los productos");
  }

  return products;
};

/**
 * Inserta un nuevo producto en la base de datos
 * @param product Datos del producto
 * @returns Resultado de la inserción
 */
export const addProduct = async (formData: FormData) => {
  const supabase = await createClient();

  const data = {
    nombre: formData.get("nombre") as string,
    descripcion: formData.get("descripcion") as string,
    precio: parseInt(formData.get("precio") as string),
    stock: parseInt(formData.get("stock") as string),
    tienda_id: parseInt(formData.get("tienda_id") as string),
    imagen_url: formData.get("imagen_url") as File,
  };

  let imageUrl: string | null = null;

  if (data.imagen_url) {
    const { data: imageData, error } = await supabase.storage
      .from("imagenes-productos")
      .upload(`productos/${data.tienda_id}-${Date.now()}`, data.imagen_url, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(
        "Error al subir la imagen del producto: " + error.message
      );
    }

    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${imageData?.fullPath}`;
  }

  const { data: addedProduct, error } = await supabase
    .from("productos")
    .insert({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      tienda_id: data.tienda_id,
      imagen_url: imageUrl,
    });

  if (error) {
    throw new Error("Error al insertar el producto");
  }

  revalidatePath("/dashboard/products");
  return addedProduct;
};

/**
 * Elimina un producto de la base de datos.
 * @param productId El ID del producto a eliminar.
 * @returns Resultado de la eliminación.
 */
export const deleteProduct = async (productId: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error("Error al eliminar el producto: " + error.message);
  }

  revalidatePath("/dashboard/products");
  return data;
};

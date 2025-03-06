"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  getProductById,
  updateProduct,
} from "@/app/dashboard/products/actions";

type EditProduct = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageFile: File | null;
  imageUrl: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams(); // El ID del producto viene de la URL

  const [product, setProduct] = useState<EditProduct>({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
    description: "",
    imageFile: null,
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const prod = await getProductById(Number(id));
        setProduct({
          id: prod.id,
          name: prod.nombre,
          price: prod.precio,
          stock: prod.stock!,
          description: prod.descripcion!,
          imageFile: null,
          imageUrl: prod.imagen_url || "",
        });
        setImagePreview(prod.imagen_url || null);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files ? files[0] : null;
      setProduct((prev) => ({ ...prev, imageFile: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "stock" ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", product.name);
      formData.append("descripcion", product.description);
      formData.append("precio", product.price.toString());
      formData.append("stock", product.stock.toString());
      if (product.imageFile) {
        formData.append("imagen_url", product.imageFile);
      }
      await updateProduct(formData, product.id);
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando producto...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Input
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Precio
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              className="col-span-3"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              className="col-span-3"
              required
              min="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageFile" className="text-right">
              Imagen del Producto
            </Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="col-span-3"
            />
            {imagePreview && (
              <div className="col-span-4 text-center">
                <Image
                  src={imagePreview}
                  alt="Vista previa de la imagen"
                  className="h-24 w-24 object-contain mx-auto"
                  width={96}
                  height={96}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar Producto"}
          </Button>
        </div>
      </form>
    </div>
  );
}

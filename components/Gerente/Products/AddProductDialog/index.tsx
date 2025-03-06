"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addProduct } from "@/app/dashboard/products/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  imageFile?: File | null;
};

export function AddProductDialog({ tiendaId }: { tiendaId: number }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
    description: "",
    imageFile: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", product.name);
      formData.append("descripcion", product.description || "");
      formData.append("precio", product.price.toString());
      formData.append("stock", product.stock.toString());
      formData.append("tienda_id", tiendaId.toString());
      if (product.imageFile) {
        formData.append("imagen_url", product.imageFile);
      }

      await addProduct(formData);
      setIsOpen(false);
      setProduct({
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        description: "",
        imageFile: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          name === "price" || name === "stock"
            ? Number.parseFloat(value)
            : value,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Añadir Producto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Producto</DialogTitle>
          <DialogDescription>
            Añade un nuevo producto a tu inventario. Haz clic en guardar cuando
            hayas terminado.
          </DialogDescription>
        </DialogHeader>
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
                Descripción (opcional)
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
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

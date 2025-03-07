"use client";

import { ChangeEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStoreAction } from "@/app/dashboard/create-store/actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  gerenteWallet: string;
  categories:
    | {
        id: number;
        nombre: string;
      }[]
    | null;
};

export default function CreateStoreForm({ gerenteWallet, categories }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    tipo_id: "",
    logoFile: null as File | null,
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "logoFile") {
      const file = files ? files[0] : null;
      setForm({ ...form, logoFile: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setLogoPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("nombre", form.nombre);
        formData.append("direccion", form.direccion);
        formData.append("tipo_id", form.tipo_id);
        if (form.logoFile) {
          formData.append("logoFile", form.logoFile);
        }
        formData.append("gerenteId", gerenteWallet);

        await createStoreAction(formData);

        router.push("/dashboard/products");
      } catch (error: any) {
        setError(error.message || "Error al crear la tienda");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block font-medium mb-1">
          Nombre de la Tienda
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="direccion" className="block font-medium mb-1">
          Dirección
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="tipo_id" className="block font-medium mb-1">
          Tipo de Tienda
        </label>
        <select
          id="tipo_id"
          name="tipo_id"
          value={form.tipo_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="" selected disabled>
            Selecciona un tipo de tienda
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="logoFile" className="block font-medium mb-1">
          Logo de la Tienda (opcional)
        </label>
        <input
          type="file"
          id="logoFile"
          name="logoFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        {logoPreview && (
          <Image
            src={logoPreview}
            alt="Vista previa del logo"
            className="mt-4 max-h-40 object-contain"
            width={200}
            height={200}
          />
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creando..." : "Crear Tienda"}
      </Button>
    </form>
  );
}

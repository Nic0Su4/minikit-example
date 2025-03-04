"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateStoreForm from "@/components/Gerente/CreateStoreForm";
import { createClient } from "@/utils/supabase/client";
import { MiniKit } from "@worldcoin/minikit-js";
export default function CreateStorePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { id: number; nombre: string }[] | null
  >([]);
  const gerenteWallet = MiniKit.walletAddress;

  useEffect(() => {
    if (!gerenteWallet) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      const supabase = createClient();
      const { data: user } = await supabase
        .from("usuarios")
        .select("*")
        .eq("wallet_address", gerenteWallet)
        .single();

      if (user?.rol === "usuario") {
        router.push("/home");
        return;
      }

      const { data: categories } = await supabase
        .from("tipos_tiendas")
        .select("id, nombre");

      setCategories(categories || []);
    };

    fetchData();
  }, [gerenteWallet, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="max-w-lg w-full p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Crear Tienda</h1>
        <p className="mb-6 text-gray-600">
          Llena los detalles para registrar tu tienda. El logo es opcional.
        </p>
        {gerenteWallet && (
          <CreateStoreForm
            gerenteWallet={gerenteWallet}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}

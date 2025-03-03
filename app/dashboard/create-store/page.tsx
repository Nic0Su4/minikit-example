import CreateStoreForm from "@/components/Gerente/CreateStoreForm";
import { createClient } from "@/utils/supabase/server";
import { MiniKit } from "@worldcoin/minikit-js";
import { redirect } from "next/navigation";

export default async function CreateStorePage() {
  const supabase = await createClient();

  const gerenteWallet = MiniKit.walletAddress;

  if (!gerenteWallet) {
    redirect("/");
  }

  const { data: user } = await supabase
    .from("usuarios")
    .select("*")
    .eq("wallet_address", gerenteWallet)
    .single();

  if (user?.rol === "usuario") {
    redirect("/home");
  }

  const { data: categories } = await supabase
    .from("tipos_tiendas")
    .select("id, nombre");

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="max-w-lg w-full p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Crear Tienda</h1>
        <p className="mb-6 text-gray-600">
          Llena los detalles para registrar tu tienda. El logo es opcional.
        </p>
        <CreateStoreForm
          gerenteWallet={gerenteWallet}
          categories={categories}
        />
      </div>
    </div>
  );
}

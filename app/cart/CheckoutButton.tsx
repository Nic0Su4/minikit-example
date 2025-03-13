"use client";

import { Item } from "@/db/types";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  items: Item[];
}

export default function CheckoutButton({ items }: CheckoutButtonProps) {
  const router = useRouter();

  const handleCheckout = () => {
    // TODO: Implementar checkout
    console.log("Procesando pago por:", items);
    // router.push("/checkout")
  };

  return (
    <button
      className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
      onClick={handleCheckout}
    >
      Proceder al pago
    </button>
  );
}

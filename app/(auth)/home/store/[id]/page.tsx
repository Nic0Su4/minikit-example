"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/User/Products/ProductCard";
import CartSummary from "@/components/User/Products/CartSummary";
import { ArrowLeft } from "lucide-react";

export default function StorePage({ params }: { params: { id: string } }) {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [storeName, setStoreName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCart([]);
  }, [params.id]);

  const addToCart = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: productId, quantity: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </button>
        <h1 className="text-xl font-bold">
          {storeName ? storeName : "Cargando..."}
        </h1>
        <div />
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
        {cart.length > 0 && (
          <CartSummary
            cart={cart}
            products={products}
            onCheckout={() => router.push("/checkout")}
          />
        )}
      </div> */}
    </div>
  );
}

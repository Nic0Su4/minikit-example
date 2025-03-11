"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Item } from "@/db/types";
import { Minus, Plus } from "lucide-react";

interface ItemDetailViewProps {
  item: Item;
  storeName: string;
}

export default function ItemDetailView({
  item,
  storeName,
}: ItemDetailViewProps) {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    // Implementar lógica para añadir al carrito
    console.log(`Añadiendo ${quantity} unidades de ${item.name} al carrito`);
  };

  const buyNow = () => {
    // Implementar lógica para comprar ahora
    console.log(`Comprando ${quantity} unidades de ${item.name}`);
  };

  return (
    <div className="flex flex-col max-w-md mx-auto">
      {/* Product Image */}
      <div className="w-full aspect-square bg-gray-200 relative">
        <Image
          src={item.imageImgLink || "/placeholder.svg?height=400&width=400"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">{item.name}</h1>
        <p className="text-sm text-gray-600">
          Vendido por <span className="font-medium">{storeName}</span>
        </p>

        <div className="text-2xl font-bold">S/{item.price.toFixed(2)}</div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Cantidad</p>
          <div className="flex items-center">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 border rounded-md flex items-center justify-center"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-8 h-8 border rounded-md flex items-center justify-center"
              disabled={quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {item.description && (
          <div>
            <h2 className="font-semibold mb-2">Descripción</h2>
            <p className="text-sm text-gray-700">{item.description}</p>
          </div>
        )}

        {item.instruction && (
          <div>
            <h2 className="font-semibold mb-2">Instrucciones</h2>
            <p className="text-sm text-gray-700">
              {item.instruction.instructions}
            </p>

            {item.instruction.contactNumber && (
              <p className="text-sm text-gray-700 mt-2">
                Contacto: {item.instruction.contactNumber}
              </p>
            )}

            {item.instruction.direction && (
              <p className="text-sm text-gray-700 mt-2">
                Dirección: {item.instruction.direction}
              </p>
            )}
          </div>
        )}

        {item.specifications && item.specifications.length > 0 && (
          <div>
            <h2 className="font-semibold mb-2">Especificaciones</h2>
            <div className="space-y-1">
              {item.specifications.map((spec, index) => (
                <div key={index} className="flex text-sm">
                  <span className="font-medium mr-2">{spec.name}:</span>
                  <span className="text-gray-700">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <Button
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={addToCart}
          >
            Añadir al carrito
          </Button>

          <Button
            variant="outline"
            className="w-full border-black text-black hover:bg-gray-100"
            onClick={buyNow}
          >
            Comprar ahora
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFetchTienda } from "@/hooks/useFetchTienda";
import { MiniKit } from "@worldcoin/minikit-js";
import Link from "next/link";
import { useEffect } from "react";

export default function GerentePage() {
  const { tienda, fetchTienda } = useFetchTienda();

  useEffect(() => {
    fetchTienda(MiniKit.walletAddress!);
  }, [fetchTienda]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard de {tienda?.nombre}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/products">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Gestionar Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Añadir, editar, actualizar stock y eliminar productos</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/store">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Información de la Tienda</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ver y editar la información de tu tienda</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

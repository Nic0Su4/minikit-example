"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteProductButton from "@/components/Gerente/Products/DeleteProductButton";
import { createClient } from "@/utils/supabase/client";
import { AddProductDialog } from "@/components/Gerente/Products/AddProductDialog";
import { getProductsByStore } from "./actions";
import { MiniKit } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [tiendaId, setTiendaId] = useState<number | null>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const gerenteAddress = MiniKit.walletAddress;

  const fetchProducts = useCallback(async (storeId: number) => {
    const products = await getProductsByStore(storeId);
    setProducts(products || []);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Verifica que exista gerenteAddress
      if (!gerenteAddress) {
        router.push("/");
        return;
      }

      // Verifica el usuario
      const { data: user } = await supabase
        .from("usuarios")
        .select("*")
        .eq("wallet_address", gerenteAddress)
        .single();

      if (user?.rol === "usuario") {
        router.push("/home");
        return;
      }

      // Obtén la tienda
      const { data: tienda } = await supabase
        .from("tiendas")
        .select("*")
        .eq("gerente_address", gerenteAddress!)
        .single();

      if (tienda?.id) {
        setTiendaId(tienda.id);
        await fetchProducts(tienda.id);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [gerenteAddress, router, supabase, fetchProducts]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        {tiendaId && (
          <AddProductDialog
            tiendaId={tiendaId}
            onProductAdded={() => {
              if (tiendaId) fetchProducts(tiendaId);
            }}
          />
        )}
      </div>
      {products.length === 0 ? (
        <div>No hay productos, comienza añadiendo productos</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.descripcion}</TableCell>
                <TableCell>S/{product.precio}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/products/edit/${product.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      onProductAdded={() => {
                        if (tiendaId) fetchProducts(tiendaId);
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

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

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [tiendaId, setTiendaId] = useState<number>();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const gerenteAddress = MiniKit.walletAddress;

      if (!gerenteAddress) {
        router.push("/");
        return;
      }

      const { data: user } = await supabase
        .from("usuarios")
        .select("*")
        .eq("wallet_address", gerenteAddress)
        .single();

      if (user?.rol === "usuario") {
        router.push("/home");
        return;
      }

      const { data: tienda } = await supabase
        .from("tiendas")
        .select("*")
        .eq("gerente_address", gerenteAddress)
        .single();

      const products = await getProductsByStore(tienda!.id);
      setProducts(products || []);
      setTiendaId(tienda!.id);
    }

    fetchData();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        {tiendaId && <AddProductDialog tiendaId={tiendaId} />}
      </div>
      {products?.length === 0 || !products ? (
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
                    <DeleteProductButton productId={product.id} />
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

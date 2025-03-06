"use client";

import { PayBlock } from "@/components/PaySwap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchCategories } from "@/hooks/useFetchCategories";
import { useFetchTienda } from "@/hooks/useFetchTienda";
import { MiniKit } from "@worldcoin/minikit-js";
import Link from "next/link";
import { useEffect } from "react";

export default function GerentePage() {
  const { tienda, fetchTienda } = useFetchTienda();
  const { categories, fetchCategories } = useFetchCategories();

  useEffect(() => {
    fetchTienda(MiniKit.walletAddress!);
    fetchCategories();
  }, [fetchTienda, fetchCategories]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard de {tienda?.nombre}</h1>
      <PayBlock />
    </div>
  );
}

function StoreFormSkeleton() {
  return (
    <div className="space-y-6 border rounded-lg p-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-40 mx-auto" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

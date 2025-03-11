"use client";

import Link from "next/link";
import { Menu, ShoppingCart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-2">
        <Link href="/home" className="font-medium">
          <Store className="h-5 w-5" />
          KipiMarketplace
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Buscar">
          <ShoppingCart className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Menú">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

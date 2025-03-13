import Link from "next/link";
import { ShoppingCart, Menu, Store } from "lucide-react";
import { getCookieCart } from "@/app/cart/actions";

export function TopBar() {
  const cookieCart = getCookieCart();

  const getTotalCount = () => {
    let items = 0;
    Object.values(cookieCart).forEach((value) => {
      items += value as number;
    });

    return items;
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 border-b bg-background z-10">
      <Link href="/home" className="flex items-center">
        <Store className="h-6 w-6" />
        <span className="ml-2 font-semibold">KipiMarketplace</span>
      </Link>
      <div className="flex items-center">
        <Link href="/cart" className="relative">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {getTotalCount()}
          </span>
        </Link>
      </div>
    </div>
  );
}

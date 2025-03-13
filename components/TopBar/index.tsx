import Link from "next/link";
import { ShoppingCart, Menu, Store } from "lucide-react";
import { cookies } from "next/headers";
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
    <div className="flex justify-between items-center p-4 border-b">
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
        <button className="ml-4">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ShoppingCart, Menu, Store } from "lucide-react";
import { cookies } from "next/headers";

export function TopBar() {
  const cookieStore = cookies();
  const cart = JSON.parse(cookieStore.get("cart")?.value ?? "{}");

  const getTotalCount = () => {
    let items = 0;
    Object.values(cart).forEach((value) => {
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

import { getStoreById } from "@/db/store";
import { getItemsByStore } from "@/db/item";
import { Item } from "@/db/types";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import StoreHeader from "./StoreHeader";

export default async function StorePage({
  params,
}: {
  params: { id: string };
}) {
  const storeId = params.id;

  const store = await getStoreById(storeId);
  const items = await getItemsByStore(storeId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <StoreHeader storeName={store.name} itemCount={items.length} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          {items.length > 0 ? (
            items.map((item: Item) => (
              <Link key={item.id} href={`/home/item/${item.id}`}>
                <Card className="hover:shadow-lg transition-shadow border-0">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <div className="bg-gray-200 aspect-square w-full relative">
                        <Image
                          src={item.imageImgLink || ""}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="font-semibold mt-1">
                          S/.{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center py-8 text-muted-foreground">
              No hay productos en esta tienda
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

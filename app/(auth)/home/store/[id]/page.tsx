import { getStoreById } from "@/db/store";
import { getItemsByStore } from "@/db/item";
import { Item } from "@/db/types";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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
        <h1 className="text-3xl font-bold mb-8">{store.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          {items.length > 0 ? (
            items.map((item: Item) => (
              <Link key={item.id} href={`/home/item/${item.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent>
                    <div className="flex justify-between">
                      <Image src={item.imageImgLink || ""} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                        <p>{item.stock}</p>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p>No hay tiendas en esta categoría</p>
          )}
        </div>
      </div>
    </div>
  );
}

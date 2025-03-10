import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getCategoryById } from "@/db/category";
import { getItemsByCategory } from "@/db/item";
import { getStoreById } from "@/db/store";
import { Store } from "@/db/types";

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategoryById(params.id);

  const items = await getItemsByCategory(params.id);

  const storeIds = Array.from(new Set(items.map((item) => item.storeId)));

  const stores = await Promise.all(storeIds.map((id) => getStoreById(id)));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <div className="grid grid-cols-1 gap-4">
        {stores.length > 0 ? (
          stores.map((store: Store) => (
            <Link key={store.id} href={`/store/${store.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{store.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <p>
                      {store.local?.direction?.direction || "Sin dirección"}
                    </p>
                    <div>
                      <Image
                        src={store.logoImgLink || ""}
                        alt="Logo tienda"
                        height={50}
                        width={50}
                      />
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
  );
}

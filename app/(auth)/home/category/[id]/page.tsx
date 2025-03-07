import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("tipos_tiendas")
    .select("*")
    .eq("id", +params.id)
    .single();

  const { data: stores } = await supabase
    .from("tiendas")
    .select("*")
    .eq("tipo_id", +params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category?.nombre}</h1>
      <div className="grid grid-cols-1 gap-4">
        {stores ? (
          stores.map((store) => (
            <Link key={store.id} href={`/store/${store.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{store.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <p>{store.direccion}</p>
                    <div>
                      <Image
                        src={store.logo_url || ""}
                        alt="Logo tienda"
                        height={10}
                        width={10}
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

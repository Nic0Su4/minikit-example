"use client";

import { useUser } from "@/app/user-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/db/category";
import { Loader2, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryImage {
  id: string;
  name: string;
  href: string;
  icon: string | null;
}

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [categoriesImages, setCategoriesImages] = useState<CategoryImage[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        const images = fetchedCategories.map((category: any) => ({
          id: category.id,
          name: category.name,
          href: `/home/category/${category.id}`,
          // Si no existe un icono, se usa un icono por defecto (Sparkles)
          icon: category.icon || null,
        }));
        setCategoriesImages(images);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold">Kipi Marketplace</h1>
          {user?.username && (
            <span className="text-sm text-muted-foreground">
              Hola, {user.username}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
        {/* Destacados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Destacados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Productos Populares</h3>
                  <p className="text-sm text-muted-foreground">
                    Descubre los productos más vendidos
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push("/marketplace")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ir al Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {categoriesImages.length > 0 ? (
            categoriesImages.map((category) => (
              <Link key={category.id} href={category.href}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-center text-4xl">
                      {category.icon}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-sm">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
        </div>
      </div>
    </div>
  );
}

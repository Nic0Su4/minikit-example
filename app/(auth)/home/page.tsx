"use client";

import { useUser } from "@/app/user-context";
import { TopBar } from "@/components/TopBar";
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
    <>
      <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
        <h2 className="text-2xl font-bold">Categorías</h2>
        <div className="grid grid-cols-1 gap-4">
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
    </>
  );
}

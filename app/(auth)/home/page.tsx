"use client";

import { useUser } from "@/app/user-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { getCategories } from "@/db/category";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Carrousel from "./components/carrousel";

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
      <Carrousel />
      <h2 className="text-2xl font-bold">Categorías</h2>
      <div className="grid grid-cols-1 gap-4">
        {categoriesImages.length > 0 ? (
          categoriesImages.map((category) => (
            <Link key={category.id} href={category.href}>
              <Card
                className="overflow-hidden transition-all duration-200 hover:shadow-lg"
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="flex justify-center">
                  <CardTitle className="text-4xl transition-transform duration-500">
                    {category.icon ? (
                      <span
                        className={
                          hoveredCard === category.id
                            ? "scale-110"
                            : "scale-100"
                        }
                      >
                        {category.icon}
                      </span>
                    ) : (
                      <Sparkles
                        className={
                          hoveredCard === category.id
                            ? "scale-110"
                            : "scale-100"
                        }
                      />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm">{category.name}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                  <span className="flex items-center text-sm font-medium text-primary">
                    Explorar
                    <ArrowRight
                      className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                        hoveredCard === category.id ? "translate-x-1" : ""
                      }`}
                    />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
      </div>
    </div>
  );
}

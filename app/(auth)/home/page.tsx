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
import Image from "next/image";

interface CategoryImage {
  id: string;
  name: string;
  href: string;
  imgLink: string | null;
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
          imgLink: category.imgLink || null,
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
      <section>
        <h2 className="text-2xl font-bold">Categorías</h2>
        <p className="text-sm text-gray-400">
          Explora y descubre productos especializados en cada categoría
          cuidadosamente organizada.
        </p>
      </section>
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
                    {/* {category.icon ? (
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
                    )} */}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {category.imgLink ? (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden mx-auto">
                      <img
                        
                        src={category.imgLink || ""}
                        alt={category.name}
                        width={96}
                        height={96}
                        // fill
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <Sparkles className="h-12 w-12 text-primary" />
                  )}
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

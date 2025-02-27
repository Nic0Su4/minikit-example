"use client";

import { useUser } from "@/app/user-context";
import PayProduct from "@/components/PayProduct";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShoppingBag, Tag, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Productos de ejemplo
const sampleProducts = [
  {
    id: "prod-1",
    name: "Camiseta Kipi Edición Limitada",
    price: 0.1,
    image: "/placeholder.svg?height=200&width=200",
    seller: {
      username: "kipi_store",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description:
      "Camiseta de edición limitada con diseño exclusivo de Kipi Marketplace.",
  },
  {
    id: "prod-2",
    name: "Zapatillas Deportivas World",
    price: 0.25,
    image: "/placeholder.svg?height=200&width=200",
    seller: {
      username: "world_fashion",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description: "Zapatillas deportivas de alta calidad con el logo de World.",
  },
  {
    id: "prod-3",
    name: "Taza Kipi Marketplace",
    price: 0.05,
    image: "/placeholder.svg?height=200&width=200",
    seller: {
      username: "kipi_store",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description: "Taza de cerámica con el logo de Kipi Marketplace.",
  },
];

export default function MarketplacePage() {
  const { user, isLoading } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleBuyProduct = (product: any) => {
    setSelectedProduct(product);
    setShowPayment(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header fijo */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold">Kipi Marketplace</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/home")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Marketplace</h1>
          {user?.username && (
            <span className="text-sm text-muted-foreground">
              {user.username}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {!user?.username ? (
          <div className="text-center py-8">
            <p>Por favor, inicia sesión para ver los productos</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Iniciar sesión
            </Button>
          </div>
        ) : showPayment ? (
          <div className="my-8 space-y-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setShowPayment(false)}
            >
              ← Volver a productos
            </Button>
            <PayProduct product={selectedProduct} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar productos..." className="pl-10" />
            </div>

            {/* Tabs de categorías */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="clothing">Ropa</TabsTrigger>
                <TabsTrigger value="accessories">Accesorios</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-4">
                {sampleProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-video w-full bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Tag className="h-3.5 w-3.5 mr-1" />
                        <span>{product.price} WLD</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => handleBuyProduct(product)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Comprar ahora
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="clothing" className="mt-4 space-y-4">
                {sampleProducts
                  .filter((p) => p.id === "prod-1")
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video w-full bg-muted">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          <span>{product.price} WLD</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => handleBuyProduct(product)}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Comprar ahora
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="accessories" className="mt-4 space-y-4">
                {sampleProducts
                  .filter((p) => p.id === "prod-3")
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video w-full bg-muted">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          <span>{product.price} WLD</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => handleBuyProduct(product)}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Comprar ahora
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Navegación inferior */}
      <nav className="sticky bottom-0 bg-background border-t p-2">
        <div className="flex justify-around max-w-md mx-auto">
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto py-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs mt-1">Productos</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto py-2"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Buscar</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center h-auto py-2"
          >
            <Tag className="h-5 w-5" />
            <span className="text-xs mt-1">Mis Compras</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

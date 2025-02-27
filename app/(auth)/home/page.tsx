"use client";

import { useUser } from "@/app/user-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";

export default function HomePage() {
  const { user, isLoading } = useUser();

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
              <Button className="w-full" variant="outline">
                Ver más
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">150+</p>
              <p className="text-xs text-muted-foreground">
                Productos disponibles
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">50+</p>
              <p className="text-xs text-muted-foreground">Usuarios activos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import WalletAuthBlock from "@/components/WalletAuthBlock";
import { useUser } from "./user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Kipi Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Conecta tu wallet para comenzar
          </p>
        </div>

        <WalletAuthBlock />

        <p className="text-center text-sm text-muted-foreground">
          Al conectar tu wallet, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}

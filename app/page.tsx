"use client";

import { PayBlock } from "@/components/PaySwap";
import WalletAuthBlock from "@/components/WalletAuthBlock";
import { useUser } from "./user-context";
import ConversionRateComponent from "@/components/ConversionRate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">WorldApp Demo</h1>

        <WalletAuthBlock />

        {user?.username && (
          <Tabs defaultValue="pay" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pay">Pagos</TabsTrigger>
              <TabsTrigger value="rates">Tasas de Conversión</TabsTrigger>
            </TabsList>
            <TabsContent value="pay">
              <Card className="p-4">
                <PayBlock />
              </Card>
            </TabsContent>
            <TabsContent value="rates">
              <Card className="p-4">
                <ConversionRateComponent />
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}

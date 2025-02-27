"use client";

import { useState } from "react";
import {
  MiniKit,
  type PayCommandInput,
  Tokens,
  tokenToDecimals,
} from "@worldcoin/minikit-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Tag,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

// Constantes
const RECEIVER_ADDRESS = "0x669e29E89328B5D1627731b82fD503287971D358";

// Tipos
interface ProductProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  seller: {
    username: string;
    avatar?: string;
  };
  description?: string;
}

// Componente principal
export const PayProduct = ({ product }: { product?: ProductProps }) => {
  // Si no hay producto, usamos uno de ejemplo
  const defaultProduct: ProductProps = {
    id: "prod-123",
    name: "Camiseta Kipi Edición Limitada",
    price: 0.1,
    image: "/placeholder.svg?height=200&width=200",
    seller: {
      username: "kipi_store",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    description:
      "Camiseta de edición limitada con diseño exclusivo de Kipi Marketplace. Material 100% algodón.",
  };

  const productData = product || defaultProduct;

  // Estados
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Función para manejar el pago
  const sendPayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError("");
    setPaymentStep(1);
    setProgressValue(10);

    try {
      // Paso 1: Iniciar el pago
      setStatus("Iniciando el proceso de pago...");
      const initRes = await fetch("/api/initiate-payment", { method: "POST" });

      if (!initRes.ok) {
        throw new Error(
          "Error al iniciar el pago. Por favor, intenta de nuevo."
        );
      }

      const { id: reference } = await initRes.json();
      console.log("Referencia generada:", reference);
      setProgressValue(20);

      // Paso 2: Preparar el pago con MiniKit
      setStatus("Preparando la transacción...");

      if (!MiniKit.isInstalled()) {
        throw new Error(
          "WorldApp no está instalada. Por favor, instala WorldApp para continuar."
        );
      }

      const payload: PayCommandInput = {
        reference,
        to: RECEIVER_ADDRESS,
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(
              productData.price,
              Tokens.WLD
            ).toString(),
          },
        ],
        description: `Pago por: ${productData.name}`,
      };

      setPaymentStep(2);
      setProgressValue(40);
      setStatus("Esperando confirmación en WorldApp...");

      // Paso 3: Ejecutar el pago
      let finalPayload;
      try {
        const result = await MiniKit.commandsAsync.pay(payload);
        finalPayload = result.finalPayload;
        setProgressValue(60);
      } catch (e: any) {
        if (
          e.message &&
          e.message.includes("No handler for event miniapp-payment")
        ) {
          console.warn("Error de handler ignorado:", e.message);
          throw new Error(
            "No se pudo completar el pago. Por favor, intenta de nuevo."
          );
        } else {
          throw e;
        }
      }

      if (finalPayload?.status !== "success") {
        throw new Error(
          `Error en el pago: ${finalPayload?.error_code || "Desconocido"}`
        );
      }

      setPaymentStep(3);
      setProgressValue(80);
      setStatus("Pago completado. Confirmando con el vendedor...");

      // Paso 4: Confirmar el pago en el backend
      const confirmRes = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!confirmRes.ok) {
        throw new Error(
          "Error al confirmar el pago. El pago se realizó pero hubo un problema al notificar al vendedor."
        );
      }

      const confirmData = await confirmRes.json();
      if (!confirmData.success) {
        throw new Error(
          "Confirmación de pago fallida. Por favor, contacta al soporte."
        );
      }

      // Paso 5: Finalizar el proceso
      setPaymentStep(4);
      setProgressValue(100);
      setStatus("¡Pago completado exitosamente!");
      setIsPaymentComplete(true);
    } catch (error: any) {
      console.error("Error en el pago:", error);
      setError(error.message || "Error desconocido durante el proceso de pago");
      setStatus("");
      setProgressValue(0);
    } finally {
      setIsProcessing(false);
      setIsConfirmDialogOpen(false);
    }
  };

  // Función para reiniciar el estado del pago
  const resetPayment = () => {
    setStatus("");
    setError("");
    setPaymentStep(0);
    setProgressValue(0);
    setIsPaymentComplete(false);
  };

  // Renderizado del componente
  return (
    <Card className="w-full max-w-md shadow-md overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Detalles del Producto
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {productData.price} WLD
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del producto */}
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={productData.image || "/placeholder.svg"}
              alt={productData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-base">{productData.name}</h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Tag className="h-3.5 w-3.5 mr-1" />
              <span>{productData.price} WLD</span>
            </div>
            <div className="flex items-center mt-2">
              <Avatar className="h-5 w-5 mr-2">
                <AvatarImage src={productData.seller.avatar} />
                <AvatarFallback>
                  {productData.seller.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {productData.seller.username}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Estado del pago */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso del pago</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <p className="text-sm text-center text-muted-foreground mt-2">
              {status}
            </p>
          </div>
        )}

        {isPaymentComplete && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">
              ¡Pago completado!
            </AlertTitle>
            <AlertDescription className="text-green-600">
              Tu pago ha sido procesado exitosamente. El vendedor ha sido
              notificado.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2">
        {!isPaymentComplete ? (
          <Dialog
            open={isConfirmDialogOpen}
            onOpenChange={setIsConfirmDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pagar Ahora
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirmar Pago</DialogTitle>
                <DialogDescription>
                  Estás a punto de realizar un pago de {productData.price} WLD
                  por &quot;{productData.name}&quot;.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md">
                <Info className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  El pago se realizará a través de WorldApp usando tu wallet
                  conectada.
                </p>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmDialogOpen(false)}
                  className="sm:mr-2"
                >
                  Cancelar
                </Button>
                <Button onClick={sendPayment} disabled={isProcessing}>
                  Confirmar Pago
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button variant="outline" className="w-full" onClick={resetPayment}>
            Volver a la tienda
          </Button>
        )}

        <p className="text-xs text-center text-muted-foreground w-full">
          Pago seguro a través de WorldApp. Protegido por Kipi Marketplace.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PayProduct;

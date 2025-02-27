"use client";

import React, { useEffect, useState } from "react";
import {
  MiniKit,
  WalletAuthInput,
  MiniAppWalletAuthSuccessPayload,
} from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/user-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Loader2, CheckCircle2, XCircle, Wallet } from "lucide-react";

export const WalletAuthBlock: React.FC = () => {
  const [authResult, setAuthResult] =
    useState<MiniAppWalletAuthSuccessPayload | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { setUser, user } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (MiniKit.isInstalled() && MiniKit.user && MiniKit.user.username) {
      setUser(MiniKit.user);
      setSuccess(true);
    }
  }, [setUser]);

  useEffect(() => {
    if (success && user) {
      router.push("/home");
    }
  }, [success, user, router]);

  const signInWithWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      if (!MiniKit.isInstalled()) {
        setError(
          "WorldApp no está instalado. Por favor, instala WorldApp para continuar."
        );
        setIsLoading(false);
        return;
      }

      setStatus("Obteniendo nonce...");

      const res = await fetch("/api/nonce");
      if (!res.ok) {
        throw new Error("Error al obtener el nonce");
      }

      const { nonce } = await res.json();

      setStatus("Firmando mensaje con la wallet...");
      const { commandPayload: generateMessageResult, finalPayload } =
        await MiniKit.commandsAsync.walletAuth({
          nonce: nonce,
          expirationTime: new Date(
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000
          ),
          notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          statement:
            "Este mensaje confirma tu identidad en nuestra aplicación. Al firmar, estás autorizando el acceso seguro a tu cuenta.",
        } as WalletAuthInput);

      if (finalPayload.status === "error") {
        setError(`Error en wallet auth: ${finalPayload.details}`);
        setIsLoading(false);
        return;
      } else {
        setAuthResult(finalPayload as MiniAppWalletAuthSuccessPayload);
        setStatus("Wallet autenticada exitosamente");

        const maxAttempts = 10;
        let attempts = 0;
        const intervalId = setInterval(() => {
          attempts++;
          if (MiniKit.user && MiniKit.user.username) {
            console.log("User data:", MiniKit.user);
            setUser(MiniKit.user);
            clearInterval(intervalId);
            setSuccess(true);
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            setError(
              "No se pudo obtener la información del usuario después de varios intentos"
            );
          }
        }, 1000);

        await completeSiwe(
          finalPayload as MiniAppWalletAuthSuccessPayload,
          nonce
        );
      }
    } catch (err) {
      console.error("Error during wallet authentication:", err);
      setError(
        `Error durante la autenticación: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const completeSiwe = async (
    payload: MiniAppWalletAuthSuccessPayload,
    nonce: string
  ) => {
    try {
      setStatus("Verificando autenticación en backend...");
      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, nonce }),
      });

      if (!response.ok) {
        throw new Error(
          `Error en la respuesta del servidor: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.status === "success" && data.isValid) {
        setStatus("Autenticación verificada exitosamente");
        setUser(MiniKit.user);
        setSuccess(true);
      } else {
        setError(
          `Error en la verificación: ${data.message || "Verificación fallida"}`
        );
      }
    } catch (err) {
      console.error("Error completing SIWE verification:", err);
      setError(
        `Error en la verificación: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthResult(null);
    setSuccess(false);
    setStatus("");
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Wallet Auth</CardTitle>
          {success && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Conectado
            </Badge>
          )}
        </div>
        <CardDescription>
          Inicia sesión con tu wallet de Ethereum a través de WorldApp
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {status || "Procesando..."}
            </p>
          </div>
        )}

        {success && user && (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">
                Autenticado correctamente
              </AlertTitle>
              <AlertDescription className="text-green-600">
                Tu wallet está conectada y verificada
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage
                  src={user.profilePictureUrl || ""}
                  alt={user.username || ""}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.username ? getInitials(user.username) : "WA"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="font-medium">
                  {user.username || "Usuario WorldApp"}
                </p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Wallet className="h-3 w-3 mr-1 inline" />
                  {truncateAddress(MiniKit.walletAddress || "")}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !success && (
          <div className="space-y-4">
            <div className="rounded-lg border p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Conecta tu wallet de Ethereum para acceder a todas las
                funcionalidades de la aplicación.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-1 h-px bg-muted"></div>
              <span className="text-xs text-muted-foreground">WorldApp</span>
              <div className="flex-1 h-px bg-muted"></div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {!success ? (
          <Button
            onClick={signInWithWallet}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Conectar Wallet
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Desconectar Wallet
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletAuthBlock;

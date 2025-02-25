"use client";

import React, { useState } from "react";
import {
  MiniKit,
  PayCommandInput,
  Tokens,
  tokenToDecimals,
} from "@worldcoin/minikit-js";

const RECEIVER_ADDRESS = "0x4f2f92cf7c8d18f440bad599b4e9615838433220";

export const PayBlock = () => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pollAutoSwap = async (tokenWLD: number) => {
    const interval = 10000;
    const maxAttempts = 30;
    let attempts = 0;
    while (attempts < maxAttempts) {
      setStatus(
        `Esperando que los WLD se reflejen en Binance... (intento ${
          attempts + 1
        }/${maxAttempts})`
      );
      const swapRes = await fetch(
        "https://kipi-backend.onrender.com/binance-swap",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: tokenToDecimals(tokenWLD, Tokens.WLD).toString(),
          }),
        }
      );
      const swapData = await swapRes.json();
      if (swapData.success) {
        return swapData;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      attempts++;
    }
    throw new Error("Swap no ejecutado dentro del tiempo esperado");
  };

  const sendPayment = async (tokenWLD: number) => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);
    setError("");
    try {
      const initRes = await fetch("/api/initiate-payment", { method: "POST" });
      const { id: reference } = await initRes.json();
      console.log("Referencia generada:", reference);

      const payload: PayCommandInput = {
        reference,
        to: RECEIVER_ADDRESS,
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(tokenWLD, Tokens.WLD).toString(),
          },
        ],
        description: "Pago de WLD a cuenta central para swap",
      };

      if (!MiniKit.isInstalled()) {
        throw new Error("MiniKit no está instalado");
      }

      let finalPayload;
      try {
        const result = await MiniKit.commandsAsync.pay(payload);
        finalPayload = result.finalPayload;
      } catch (e: any) {
        if (
          e.message &&
          e.message.includes("No handler for event miniapp-payment")
        ) {
          console.warn("Error de handler ignorado:", e.message);
          throw new Error(
            "No se pudo obtener finalPayload debido al error de handler"
          );
        } else {
          throw e;
        }
      }

      if (finalPayload.status !== "success") {
        throw new Error("Error en el pago: " + finalPayload.error_code);
      }
      setStatus("Pago completado exitosamente. Referencia: " + reference);
      console.log("Pago completado exitosamente. Referencia:", finalPayload);

      setStatus("Confirmando el pago en el backend...");
      const confirmRes = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) {
        throw new Error("Confirmación de pago fallida.");
      }
      setStatus("Pago confirmado en el backend");

      // const swapRes = await fetch("/api/perform-swap", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     fromAddress: RECEIVER_ADDRESS,
      //     fromAmount: tokenToDecimals(tokenWLD, Tokens.WLD).toString(),
      //   }),
      // });
      // const swapData = await swapRes.json();
      // if (!swapData.success) {
      //   throw new Error("Swap fallido: " + swapData.error);
      // }
      // setStatus(
      //   "Swap completado exitosamente. Transacción: " + swapData.transactionHash
      // );

      setStatus("Esperando que los WLD se reflejen en Binance...");
      const swapData = await pollAutoSwap(tokenWLD);
      setStatus("Swap completado exitosamente. Transacción: " + swapData.order);
      console.log("Swap completado exitosamente:", swapData);
    } catch (error: any) {
      console.error("Error en el pago:", error);
      setError(error.message || "Error desconocido");
      setStatus("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          sendPayment(0.1);
        }}
        disabled={isProcessing}
      >
        {isProcessing ? "Procesando" : "Pagar (enviar WLD)"}
      </button>
      <div className="overflow-x-auto max-w-80">
        <p>Status: {status}</p>
        <p>Error: {error}</p>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import {
  initiatePayment,
  executePayment,
  confirmPayment,
  pollAutoSwap,
  type PaymentStatus,
} from "@/lib/payment/payment.service";

export function usePayment() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: "",
    error: "",
    isProcessing: false,
  });

  const updateStatus = (status: string) => {
    setPaymentStatus((prev) => ({ ...prev, status }));
    console.log(status);
  };

  const updateError = (error: string) => {
    setPaymentStatus((prev) => ({ ...prev, error, status: "" }));
    console.error("Error en el pago:", error);
  };

  const processPayment = async (
    tokenWLD: number,
    description = "Pago de producto",
    onSuccess?: () => void
  ) => {
    if (paymentStatus.isProcessing) {
      return;
    }

    setPaymentStatus({
      status: "Iniciando pago...",
      error: "",
      isProcessing: true,
    });

    try {
      updateStatus("Generando referencia de pago...");
      const { id: reference } = await initiatePayment();
      console.log("Referencia generada:", reference);

      updateStatus("Procesando pago con MiniKit...");
      const finalPayload = await executePayment(
        reference,
        tokenWLD,
        description
      );

      if (finalPayload.status !== "success") {
        throw new Error("Error en el pago: " + finalPayload.error_code);
      }
      updateStatus("Pago completado exitosamente. Referencia: " + reference);

      updateStatus("Confirmando el pago en el backend...");
      const confirmData = await confirmPayment(finalPayload);
      if (!confirmData.success) {
        throw new Error("Confirmación de pago fallida.");
      }
      updateStatus("Pago confirmado en el backend");

      updateStatus("Esperando que los WLD se reflejen en Binance...");
      const swapData = await pollAutoSwap(tokenWLD);
      updateStatus(
        "Swap completado exitosamente. Transacción: " + swapData.order
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      updateError(error.message || "Error desconocido");
    } finally {
      setPaymentStatus((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  return {
    paymentStatus,
    processPayment,
  };
}

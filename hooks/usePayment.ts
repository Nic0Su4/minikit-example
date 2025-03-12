"use client";

import { useState } from "react";
import {
  initiatePayment,
  executePayment,
  confirmPayment,
  pollAutoSwap,
  type PaymentStatus,
  registerPayment,
  registerBuy,
} from "@/lib/payment/payment.service";
import { BuyEntry, Item } from "@/db/types";
import {
  calculateCommissions,
  type CommissionSummary,
} from "@/lib/payment/commission.service";
import { setPayment } from "@/db/payment";

export function usePayment() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: "",
    error: "",
    isProcessing: false,
  });
  const [commissionSummary, setCommissionSummary] =
    useState<CommissionSummary | null>(null);

  const updateStatus = (status: string) => {
    setPaymentStatus((prev) => ({ ...prev, status }));
    console.log(status);
  };

  const updateError = (error: string) => {
    setPaymentStatus((prev) => ({ ...prev, error, status: "" }));
    console.error("Error en el pago:", error);
  };

  const calculateItemCommissions = async (
    purchaseItems: {
      item: Item;
      quantity: number;
      storeId: string;
    }[]
  ) => {
    try {
      const summary = await calculateCommissions(
        purchaseItems.map(({ item, quantity }) => ({ item, quantity }))
      );
      setCommissionSummary(summary);
      return summary;
    } catch (error) {
      console.error("Error al calcular comisiones:", error);
      return null;
    }
  };

  const processPayment = async (
    clientId: string,
    tokenWLD: number,
    description = "Pago de producto",
    purchaseItems: {
      item: Item;
      quantity: number;
      storeId: string;
    }[],
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
      updateStatus("Calculando comisiones...");
      const commissions = await calculateItemCommissions(purchaseItems);

      if (!commissions) {
        throw new Error("No se pudieron calcular las comisiones");
      }

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

      // * Comienza la creación de la compra
      updateStatus("Registrando el pago...");
      const totalAmount = purchaseItems.reduce(
        (sum, { item, quantity }) => sum + item.price * quantity,
        0
      );
      const commissionAmount = commissions.totalCommission;

      const paymentId = await registerPayment(
        clientId,
        totalAmount,
        commissionAmount
      );

      updateStatus("Registrando la compra...");

      const storeItemsMap = new Map<
        string,
        { itemId: string; ammount: number; redeemed: number }[]
      >();

      purchaseItems.forEach(({ item, quantity, storeId }) => {
        if (!storeItemsMap.has(storeId)) {
          storeItemsMap.set(storeId, []);
        }

        storeItemsMap.get(storeId)?.push({
          itemId: item.id,
          ammount: quantity,
          redeemed: 0,
        });
      });

      const buyEntries: BuyEntry[] = [];

      storeItemsMap.forEach((items, storeId) => {
        buyEntries.push({
          storeId,
          items,
        });
      });

      await registerBuy(clientId, paymentId, buyEntries);

      updateStatus("Compra registrada exitosamente");

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
    commissionSummary,
    calculateItemCommissions,
    processPayment,
  };
}

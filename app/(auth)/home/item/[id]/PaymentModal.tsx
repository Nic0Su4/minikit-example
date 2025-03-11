"use client";

import type { Item } from "@/db/types";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import type { PaymentStatus } from "@/lib/payment/payment.service";

interface PaymentModalProps {
  item: Item;
  quantity: number;
  onClose: () => void;
  onPay: () => void;
  paymentStatus: PaymentStatus;
}

export function PaymentModal({
  item,
  quantity,
  onClose,
  onPay,
  paymentStatus,
}: PaymentModalProps) {
  const totalPrice = item.price * quantity;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Confirmar compra</h2>
          <button onClick={onClose} disabled={paymentStatus.isProcessing}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Cantidad: {quantity}</p>
              <p className="font-semibold">S/{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Método de pago</h3>
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <span>Pago con WorldCoin (WLD)</span>
            </div>
          </div>

          {paymentStatus.status && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm flex items-center gap-2">
                {paymentStatus.isProcessing && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {paymentStatus.status}
              </p>
            </div>
          )}

          {paymentStatus.error && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-600">{paymentStatus.error}</p>
            </div>
          )}

          <div className="pt-2">
            <Button
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={onPay}
              disabled={paymentStatus.isProcessing}
            >
              {paymentStatus.isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </span>
              ) : (
                "Pagar ahora"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

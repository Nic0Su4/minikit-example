"use client";

import type { Item } from "@/db/types";
import { Button } from "@/components/ui/button";
import { X, Loader2, Info } from "lucide-react";
import type { PaymentStatus } from "@/lib/payment/payment.service";
import Image from "next/image";
import {
  type CommissionSummary,
  formatCommissionType,
  getCommissionDescription,
} from "@/lib/payment/commission.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentModalProps {
  item: Item;
  quantity: number;
  onClose: () => void;
  onPay: () => void;
  paymentStatus: PaymentStatus;
  exchangeRate: { WLDtoPEN: number; PENtoWLD: number } | null;
  commissionSummary: CommissionSummary | null;
}

export function PaymentModal({
  item,
  quantity,
  onClose,
  onPay,
  paymentStatus,
  exchangeRate,
  commissionSummary,
}: PaymentModalProps) {
  const totalPricePEN = item.price * quantity;
  const totalCommission = commissionSummary?.totalCommission || 0;
  const grandTotal = totalPricePEN + totalCommission;
  const totalPriceWLD = exchangeRate ? grandTotal * exchangeRate.PENtoWLD : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-h-[70vh] overflow-auto">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Confirmar compra</h2>
          <button onClick={onClose} disabled={paymentStatus.isProcessing}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 relative overflow-hidden">
              <Image
                src={item.imageImgLink || "/placeholder.svg?height=64&width=64"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Cantidad: {quantity}</p>
              <p className="font-semibold">S/{totalPricePEN.toFixed(2)}</p>
            </div>
          </div>

          {commissionSummary && commissionSummary.details.length > 0 && (
            <div className="border rounded-md p-3 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">
                Comisiones aplicables:
              </h3>
              <div className="space-y-2">
                {commissionSummary.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center">
                      <span>{formatCommissionType(detail.commission)}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="ml-1 text-gray-400 hover:text-gray-600">
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              {getCommissionDescription(detail.commission)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span>S/{detail.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t text-sm font-medium">
                  <span>Total comisiones:</span>
                  <span>S/{totalCommission.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Total a pagar */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm">S/{totalPricePEN.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Comisiones:</span>
              <span className="text-sm">S/{totalCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-medium">
              <span>Total a pagar:</span>
              <span>S/{grandTotal.toFixed(2)}</span>
            </div>
            {exchangeRate && (
              <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                <span>Total en WLD:</span>
                <span>{totalPriceWLD.toFixed(6)} WLD</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Método de pago</h3>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">WLD</span>
              </div>
              <div className="flex-1">
                <span className="font-medium">Pago con WorldCoin</span>
                {exchangeRate && (
                  <p className="text-xs text-gray-500">
                    Tipo de cambio: 1 WLD = S/{exchangeRate.WLDtoPEN.toFixed(2)}
                  </p>
                )}
              </div>
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

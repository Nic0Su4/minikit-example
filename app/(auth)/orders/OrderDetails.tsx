"use client";

import type { Buy } from "@/db/types";
import { useEffect, useState } from "react";
import { getStoreById } from "@/db/store";
import { getItemById } from "@/db/item";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetailsProps {
  buy: Buy;
}

interface StoreDetails {
  name: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    id: string;
  }[];
}

export default function OrderDetails({ buy }: OrderDetailsProps) {
  const [storeDetails, setStoreDetails] = useState<{
    [key: string]: StoreDetails;
  }>({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadStoreDetails = async () => {
      const details: { [key: string]: StoreDetails } = {};

      for (const entry of buy.buys) {
        try {
          const store = await getStoreById(entry.storeId);
          const items = await Promise.all(
            entry.items.map(async (item) => {
              const itemDetails = await getItemById(item.itemId);
              return {
                name: itemDetails.name,
                price: item.price || itemDetails.price,
                quantity: item.ammount,
                id: itemDetails.id,
              };
            })
          );

          details[entry.storeId] = {
            name: store.name,
            items,
          };
        } catch (error) {
          console.error(
            `Error loading details for store ${entry.storeId}:`,
            error
          );
        }
      }

      setStoreDetails(details);
      setLoading(false);
    };

    loadStoreDetails();
  }, [buy]);

  const handleDownloadQR = () => {
    setDownloading(true);

    const svg = document.querySelector(`#qr-code-${buy.paymentId} svg`);
    if (!svg) {
      setDownloading(false);
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-compra-${buy.paymentId.slice(-5)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      setDownloading(false);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="p-4 border-t">
        <p className="text-center text-gray-500">Cargando detalles...</p>
      </div>
    );
  }

  const kipiBusinessUrl = "https://kipi-business.vercel.app";

  const qrUrl = `${kipiBusinessUrl}/scan-qr?buyid=${buy.id}`;

  return (
    <div className="border-t">
      {/* Store Sections */}
      {Object.entries(storeDetails).map(([storeId, store]) => (
        <div key={storeId} className="p-4 border-b last:border-b-0">
          <h4 className="font-medium mb-3">{store.name}</h4>
          <div className="space-y-2">
            {store.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p>{item.name}</p>
                  <p className="text-gray-500 text-xs">
                    PRD-{item.id.slice(-3)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span>{item.quantity}x</span>
                  <span className="w-20 text-right">
                    S/{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Validation Code Section */}
      <div className="p-4 border-t bg-gray-50">
        <p className="text-sm text-center mb-3">Código de validación</p>
        <div className="flex flex-col items-center">
          <div
            id={`qr-code-${buy.paymentId}`}
            className="p-2 bg-white rounded-lg"
          >
            <QRCodeSVG
              value={qrUrl}
              size={128}
              level="H"
              includeMargin
              className="rounded-lg"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadQR}
            disabled={downloading}
            className="mt-2 text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            {downloading ? "Descargando..." : "Descargar QR"}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Presenta este código QR en la tienda para recibir tus productos.
          </p>
        </div>
      </div>
    </div>
  );
}

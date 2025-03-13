"use client";

import type { Store } from "@/db/types";
import { PhoneIcon as WhatsappIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface StoreHeaderProps {
  store: Store;
  categories: { id: string; name: string }[]; // Pasamos las categorías ya resueltas
}

export default function StoreHeader({ store, categories }: StoreHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-start gap-4">
        {/* Store Logo */}
        <div className="w-16 h-16 bg-gray-200 rounded-full relative overflow-hidden flex-shrink-0">
          <Image
            src={store.logoImgLink || "/placeholder.svg?height=64&width=64"}
            alt={store.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Store Info */}
        <div className="flex-1">
          <h1 className="text-xl font-bold">{store.name}</h1>

          {/* Categories */}
          <div className="flex gap-2 mt-1 flex-wrap">
            {categories.map((category) => (
              <span
                key={category.id}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Contact Details */}
          <div className="mt-4 space-y-2">
            {/* Address */}
            {store.local?.direction && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{store.local.direction.direction}</span>
              </div>
            )}

            {/* Phone */}
            {store.contact?.number && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-600">{store.contact.number}</span>
                {/* WhatsApp Link */}
                <Link
                  href={`https://wa.me/${store.contact.number.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700"
                >
                  <WhatsappIcon className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Email */}
            {store.contact?.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{store.contact.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { PayBlock } from "@/components/PaySwap";
import WalletAuthBlock from "@/components/WalletAuthBlock";
import { useUser } from "./user-context";
import ConversionRateComponent from "@/components/ConversionRate";

export default function Home() {
  const { user } = useUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      {/* <VerifyBlock /> */}
      <WalletAuthBlock />
      {user?.username && <PayBlock />}
      <ConversionRateComponent />
    </main>
  );
}

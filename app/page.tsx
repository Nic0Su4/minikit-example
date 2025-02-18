import { PayBlock } from "@/components/PaySwap";
import { VerifyBlock } from "@/components/Verify";
import WalletAuthBlock from "@/components/WalletAuthBlock";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <VerifyBlock />
      <PayBlock />
      <WalletAuthBlock />
    </main>
  );
}

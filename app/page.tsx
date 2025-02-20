import { PayBlock } from "@/components/PaySwap";
import { VerifyBlock } from "@/components/Verify";
import WalletAuthBlock from "@/components/WalletAuthBlock";
import { MiniKit } from "@worldcoin/minikit-js";
import { useUser } from "./user-context";

export default function Home() {
  const { user } = useUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      {/* <VerifyBlock /> */}
      <WalletAuthBlock />
      {user.username && <PayBlock />}
    </main>
  );
}

import axios from "axios";
("use client");
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { BrowserProvider } from "ethers";

const receiverAddress = "0x676280f89a9bc77b3a0d6d7fe0937e8550c53982";

const WLD_WORLDCHAIN_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";
const USDCE_WORLDCHAIN_ADDRESS = "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1";

const sendPayment = async (toUSDCeAmount: number) => {
  const toTokenAmount = tokenToDecimals(toUSDCeAmount, Tokens.USDCE).toString();
  try {
    const initRes = await fetch(`/api/initiate-payment`, {
      method: "POST",
    });

    const { id: reference } = await initRes.json();
    console.log("Referencia generada:", reference);

    const senderAddress = MiniKit.walletAddress;
    if (!senderAddress) {
      console.error("No sender address");
      return null;
    }
    console.log("Sender:", senderAddress);

    const fromChain = 480;
    const toChain = 480;
    const toAmount = toTokenAmount;

    const quoteRes = await axios.get("https://li.quest/v1/quote/toAmount", {
      params: {
        fromChain,
        toChain,
        fromToken: WLD_WORLDCHAIN_ADDRESS,
        toToken: USDCE_WORLDCHAIN_ADDRESS,
        toAmount,
        fromAddress: senderAddress,
      },
      headers: {
        accept: "application/json",
      },
    });
    const quote = quoteRes.data;
    console.log("Cotización obtenida:", quote);

    if (!quote.transactionRequest) {
      throw new Error("No transaction request");
    }

    const provider = new BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();

    const txRequest = quote.transactionRequest;
    const txResponse = await signer.sendTransaction({
      to: txRequest.to,
      data: txRequest.data,
      value: txRequest.value,
      gasLimit: txRequest.gasLimit,
    });
    console.log("Transacción enviada:", txResponse.hash);

    await txResponse.wait();

    const confirmRes = await fetch(`/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: { transaction_id: txResponse.hash, reference },
      }),
    });

    const payment = await confirmRes.json();
    if (payment.success) {
      console.log("Pago exitoso!");
    } else {
      console.error("Pago fallido");
    }
  } catch (error: unknown) {
    console.log("Error sending payment", error);
    return null;
  }
};

const handlePay = async () => {
  if (!MiniKit.isInstalled()) {
    console.error("MiniKit is not installed");
    return;
  }
  await sendPayment(0.5);
};

export const PayBlock = () => {
  return (
    <button className="bg-blue-500 p-4" onClick={handlePay}>
      Pay
    </button>
  );
};

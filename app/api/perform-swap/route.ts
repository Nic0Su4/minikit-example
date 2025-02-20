import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { fromAddress, fromAmount } = await req.json();
    if (!fromAddress || !fromAmount) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const quoteResponse = await axios.get("https://li.quest/v1/quote", {
      params: {
        fromChain: 480,
        toChain: 480,
        fromToken: "0x2cfc85d8e48f8eab294be644d9e25c3030863003",
        toToken: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
        fromAmount,
        fromAddress,
      },
    });
    const quote = quoteResponse.data;
    if (!quote.transactionRequest) {
      return NextResponse.json(
        { success: false, error: "No transactionRequest returned" },
        { status: 500 }
      );
    }

    console.log("Quote:", quote);

    const provider = new ethers.providers.JsonRpcProvider(
      "https://worldchain-mainnet.g.alchemy.com/public",
      { chainId: 480, name: "World Chain" }
    );
    const wallet = ethers.Wallet.fromMnemonic(
      process.env.BACKEND_MNEMONIC!,
      "m/44'/60'/0'/0/1"
    ).connect(provider);

    const tx = await wallet.sendTransaction(quote.transactionRequest);

    const receipt = await tx.wait();

    if (!receipt) {
      return NextResponse.json(
        { success: false, error: "Transaction failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (error: any) {
    console.error("Error in perform-swap endpoint:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

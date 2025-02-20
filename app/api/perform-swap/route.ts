import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import axios from "axios";

const ERC20_ABI = [
  {
    name: "approve",
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    name: "allowance",
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

async function checkAndSetAllowance(
  wallet: ethers.Wallet,
  tokenAddress: string,
  approvalAddress: string,
  amount: ethers.BigNumber
) {
  if (tokenAddress === ethers.constants.AddressZero) return;

  const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
  const currentAllowance: ethers.BigNumber = await erc20.allowance(
    await wallet.getAddress(),
    approvalAddress
  );

  if (currentAllowance.lt(amount)) {
    console.log(
      `Allowance insuficiente (${currentAllowance.toString()}), aprobando ${amount.toString()}...`
    );
    const approveTx = await erc20.approve(approvalAddress, amount);
    await approveTx.wait();
    console.log("Aprobación completada.");
  } else {
    console.log("Allowance suficiente:", currentAllowance.toString());
  }
}

if (typeof globalThis.fetch === "function") {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => {
    options.referrer = "";
    return originalFetch(url, options);
  };
}

async function waitForReceipt(
  provider: ethers.providers.Provider,
  txHash: string,
  interval = 5000,
  timeout = 60000
): Promise<ethers.providers.TransactionReceipt> {
  const start = Date.now();
  while (true) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt && receipt.blockNumber) {
      return receipt;
    }
    if (Date.now() - start > timeout) {
      throw new Error("Timeout waiting for transaction confirmation");
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

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

    const { nonce, ...txRequestWithoutNonce } = quote.transactionRequest;

    console.log("Quote:", quote);

    const provider = new ethers.providers.StaticJsonRpcProvider(
      "https://worldchain-mainnet.g.alchemy.com/v2/0e_KFa_ig5w21IqZ2HUnWc1yAkVNYmfu",
      { chainId: 480, name: "World Chain" }
    );

    const latestBlock = await provider.getBlock("latest");
    console.log("Latest block:", latestBlock.number);

    const wallet = ethers.Wallet.fromMnemonic(
      process.env.BACKEND_MNEMONIC!,
      "m/44'/60'/0'/0/1"
    ).connect(provider);
    console.log(wallet);

    const amountToApprove = ethers.BigNumber.from(fromAmount);
    await checkAndSetAllowance(
      wallet,
      quote.action.fromToken.address,
      quote.estimate.approvalAddress,
      amountToApprove
    );

    const tx = await wallet.sendTransaction(txRequestWithoutNonce);
    console.log("Transaction submitted:", tx.hash);

    const receipt = await waitForReceipt(provider, tx.hash);
    console.log("Transaction confirmed:", receipt.transactionHash);

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

import { NextRequest, NextResponse } from "next/server";
import { OrderType, Side, Spot } from "@binance/connector-typescript";

export async function POST(req: NextRequest) {
  try {
    const { quantity } = await req.json().catch(() => ({}));
    if (!quantity) {
      return NextResponse.json(
        { success: false, error: "Quantity is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: "API keys are missing" },
        { status: 500 }
      );
    }

    const client = new Spot(apiKey, apiSecret, {
      baseURL: "https://api.binance.com",
    });

    const accountResponse = await client.accountInformation();
    console.log("accountResponse", accountResponse);

    const balances = accountResponse.balances;
    const wldBalance = balances.find((b) => b.asset === "WLD");
    if (!wldBalance) {
      return NextResponse.json(
        { success: false, error: "No WLD balance" },
        { status: 400 }
      );
    }

    const freeWLD = parseFloat(wldBalance.free);
    console.log("Balance de WLD:", freeWLD);

    if (freeWLD <= parseFloat(quantity)) {
      return NextResponse.json(
        { success: false, error: "Insufficient WLD balance" },
        { status: 400 }
      );
    }

    const symbol = "WLDUSDT";

    const orderResponse = await client.newOrder(
      symbol,
      Side.SELL,
      OrderType.MARKET,
      {
        quantity: quantity,
      }
    );
    console.log("Order response:", orderResponse);

    return NextResponse.json({ success: true, order: orderResponse });
  } catch (error: any) {
    console.error("Error in auto-swap endpoint:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

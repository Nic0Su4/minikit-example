import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body recibido:", body);

    if (!body || !body.payload) {
      return NextResponse.json(
        { success: false, error: "El cuerpo no contiene 'payload'" },
        { status: 400 }
      );
    }
    const { payload } = body as IRequestPayload;
    console.log(payload);

    // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
    //   const reference = getReferenceFromDB();
    const cookieStore = cookies();

    const reference = cookieStore.get("payment-nonce")?.value;
    console.log("Cookie payment-nonce:", reference);

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Cookie 'payment-nonce' no encontrada" },
        { status: 400 }
      );
    }

    if (!payload.reference) {
      return NextResponse.json(
        { success: false, error: "El payload no contiene 'reference'" },
        { status: 400 }
      );
    }
    console.log("Payload recibido:", payload);

    console.log(payload);
    // 1. Check that the transaction we received from the mini app is the same one we sent
    if (payload.reference === reference) {
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
          },
        }
      );
      const transaction = await response.json();
      // 2. Here we optimistically confirm the transaction.
      // Otherwise, you can poll until the status == mined
      if (
        transaction.reference == reference &&
        transaction.status !== "failed"
      ) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({
          success: false,
          error: "Transacción no confirmada",
        });
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Referencia no coincide" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error en confirm-payment endpoint:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

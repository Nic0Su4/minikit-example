"use client";

import React, { useState } from "react";
import {
  MiniKit,
  WalletAuthInput,
  MiniAppWalletAuthSuccessPayload,
} from "@worldcoin/minikit-js";

export const WalletAuthBlock: React.FC = () => {
  const [authResult, setAuthResult] =
    useState<MiniAppWalletAuthSuccessPayload | null>(null);
  const [status, setStatus] = useState<string>("");

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    setStatus("Obtaining nonce...");

    const res = await fetch("/api/nonce");
    const { nonce } = await res.json();

    setStatus("Firmando mensaje con la wallet...");
    const { commandPayload: generateMessageResult, finalPayload } =
      await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        expirationTime: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        ),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement:
          "This is my statement and here is a link https://worldcoin.com/apps",
      } as WalletAuthInput);

    if (finalPayload.status === "error") {
      setStatus("Error en wallet auth: " + finalPayload.details);
      return;
    } else {
      setAuthResult(finalPayload as MiniAppWalletAuthSuccessPayload);
      setStatus("Wallet autenticada exitosamente");
      // Envía la respuesta al backend para verificar el SIWE message
      await completeSiwe(
        finalPayload as MiniAppWalletAuthSuccessPayload,
        nonce
      );
    }
  };

  const completeSiwe = async (
    payload: MiniAppWalletAuthSuccessPayload,
    nonce: string
  ) => {
    setStatus("Verificando autenticación en backend...");
    const response = await fetch("/api/complete-siwe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, nonce }),
    });
    const data = await response.json();
    if (data.status === "success" && data.isValid) {
      setStatus("Autenticación verificada exitosamente en backend");
    } else {
      setStatus("Error en la verificación en backend: " + data.message);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md mt-4">
      <h2>Wallet Auth (Sign in with Ethereum)</h2>
      <button onClick={signInWithWallet} style={{ padding: "0.5rem 1rem" }}>
        Iniciar autenticación de wallet
      </button>
      <p>{status}</p>
      {authResult && (
        <div>
          <h3>Datos de la Wallet:</h3>
          <p>Username: {MiniKit.user?.username}</p>
          <p>Dirección: {MiniKit.walletAddress}</p>
        </div>
      )}
    </div>
  );
};

export default WalletAuthBlock;

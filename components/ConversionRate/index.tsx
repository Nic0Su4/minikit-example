"use client";

import React, { useState, useEffect } from "react";

const fetchConversionRate = async () => {
  try {
    const coinResponse = await fetch(
      "https://www.worldcoinindex.com/apiservice/ticker?key=02L4vsaiNfZRP7B9a9FxZWg1RxC1gtrQXa8&label=wldbtc&fiat=usd"
    );
    const coinData = await coinResponse.json();
    console.log(coinData);

    // const fxResponse = await fetch(
    //   "https://api.exchangerate-api.com/v4/latest/USD"
    // );
    // const fxData = await fxResponse.json();
    // const usdToPen = fxData?.rates?.PEN;
    // if (!usdToPen) {
    //   throw new Error("Error obteniendo tasa USD a PEN");
    // }

    // const wldPricePEN = wldPriceUSD * usdToPen;
    // const penToWldRate = 1 / wldPricePEN;
    // return penToWldRate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function ConversionRateComponent() {
  const [conversionRate, setConversionRate] = useState(null);

  useEffect(() => {
    fetchConversionRate();

    // const getRate = async () => {
    //   const rate = await fetchConversionRate();
    //   setConversionRate(rate);
    // };
    // getRate();
    // const interval = setInterval(() => {
    //   getRate();
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* {conversionRate !== null ? (
        <p>Tasa de conversión: 1 PEN = {conversionRate.toFixed(6)} WLD</p>
      ) : (
        <p>Cargando tasa de conversión...</p>
      )} */}
      <p>hola</p>
    </div>
  );
}

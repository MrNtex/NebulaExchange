'use client'

import { CoinAdvanced } from "@/types/coins";
import { createContext, useContext, useEffect, useState } from "react";

export interface coinContext {
  coin: CoinAdvanced | null;
  setCoin: (coin: CoinAdvanced) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}


export const CoinContext = createContext<coinContext | null>(null);

export function useCoin() {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoin must be used within a CoinProvider");
  }
  return context;
}

export function CoinProvider({ children }: { children: any }) {
  const [currency, setCurrency] = useState("usd");
  const [coin, setCoin] = useState<CoinAdvanced | null>(null);
  useEffect(() => {
    console.log(coin);
  }, []);

  return (
    <CoinContext.Provider value={{ coin, setCoin, currency, setCurrency }}>
      {children}
    </CoinContext.Provider>
  );
}
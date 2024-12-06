'use client'

import { CoinAdvanced } from "@/types/coins";
import { createContext, useContext, useEffect, useState } from "react";

enum Scales {
  "1d" = "1d",
  "7d" = "7d",
  "30d" = "30d",
  "90d" = "90d",
  "1y" = "1y",
  "max" = "max",
}

export interface coinContext {
  coin: CoinAdvanced | null;
  setCoin: (coin: CoinAdvanced) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  scale: Scales;
  setScale: (scale: Scales) => void;
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
  const [scale, setScale] = useState<Scales>(Scales["1d"]);
  useEffect(() => {
    console.log(coin);
  }, []);

  return (
    <CoinContext.Provider value={{ coin, setCoin, currency, setCurrency, scale, setScale }}>
      {children}
    </CoinContext.Provider>
  );
}
import { CoinAdvanced } from "@/types/coins";

export async function fetchAdvancedCoinData(coin: string): Promise<CoinAdvanced> {
  return await fetch(`http://localhost:5000/api/coin/${coin}`).then((response) => response.json());
}
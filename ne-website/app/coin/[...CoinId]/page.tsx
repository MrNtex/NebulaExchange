'use client'

import { CryptoChart } from "@/components/charts/line-chart";
import CoinHeader from "@/components/CoinHeader";
import { fetchAdvancedCoinData } from "@/scripts/fetchAdvancedCoinData";
import { CoinAdvanced } from "@/types/coins";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Post = () => {
  const params = useParams();
  const pid = params.CoinId;
  if (!pid) return null;

  const [loading, setLoading] = useState<boolean>(true);
  const [coinInfo, setCoinInfo] = useState<CoinAdvanced | null>(null);

  const coinId = pid[0];

  useEffect(() => {
    console.log('Fetching data from server...')
    

    const fetchData = async () => {
      setLoading(true);
      const coinData = await fetch(`http://localhost:5000/api/coin/${coinId}`).then((response) => response.json());

      if (coinData) {
        setCoinInfo(coinData);
      }
      else {
        console.log('Error fetching data')
      }
      setLoading(false);
    };
    fetchData();
    
  }, []);

  console.log(coinInfo);

  return (
    <div>
      <CoinHeader coin={coinInfo} />
      <CryptoChart coin={coinId} />
    </div>
  )
}

export default Post

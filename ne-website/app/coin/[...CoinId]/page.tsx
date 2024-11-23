'use client'

import { CryptoChart } from "@/components/charts/line-chart";
import CoinHeader from "@/components/CoinHeader";
import { useParams } from "next/navigation";

type CoinInfoAdvanced = {

}
const Post = () => {
  const params = useParams();
  const pid = params.CoinId;
  if (!pid) return null;

  const coinId = pid[0];



  return (
    <div>
      <CoinHeader coin={coinId} />
      <CryptoChart coin={coinId} />
    </div>
  )
}

export default Post

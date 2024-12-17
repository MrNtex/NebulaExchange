'use client'

import { CryptoChart } from "@/modules/coin_page/line-chart";
import CoinDetails from "@/modules/coin_page/CoinDetails";
import CoinHeader from "@/components/CoinHeader";
import { coinContext, CoinProvider, useCoin } from "@/context/coinContext";
import { fetchAdvancedCoinData } from "@/scripts/fetchAdvancedCoinData";
import { CoinAdvanced } from "@/types/coins";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RangeSelect from "@/modules/coin_page/RangeSelect";
import { TickerTable } from "@/modules/coin_page/ticker-table/ticker-table";
import { columns } from "@/modules/coin_page/ticker-table/columns";

const Post = () => {
  const params = useParams();
  const pid = params.CoinId;
  if (!pid) return null;

  const [loading, setLoading] = useState<boolean>(true);
  const [coinInfo, setCoinInfo] = useState<CoinAdvanced | null>(null);

  const coinId = pid[0];

  useEffect(() => {
    console.log('Fetching data from server...');

    const fetchData = async () => {
      setLoading(true);
      const coinData = await fetch(`http://localhost:5000/api/coin/${coinId}`).then((response) =>
        response.json()
      );

      if (coinData) {
        console.log(coinData);
        setCoinInfo(coinData);
      } else {
        console.log('Error fetching data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!coinInfo) {
    return <div>Error fetching data</div>;
  }

  return (
    <CoinProvider>
      {/* Now the provider wraps everything, including setting context */}
      <Content coinInfo={coinInfo} />
    </CoinProvider>
  );
};

const Content = ({ coinInfo }: { coinInfo: CoinAdvanced }) => {
  const { setCoin, coin } = useCoin();
  const [ chartType, setChartType ] = useState<"prices" | "market_caps" | "volumes">("prices");

  useEffect(() => {
    console.log('Setting coin...');
    setCoin(coinInfo);
  }, []);


  if (coin === null) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="flex justify-between w-full">
        <div className="w-5/12">
          <CoinHeader />
          <CoinDetails />
        </div>
        <div className="w-px bg-gray-300 mx-4"></div>
        <div className="flex-1">
          <CryptoChart type={chartType}/>
          <RangeSelect />
        </div>
      </div>
      <TickerTable columns={columns} data={coin.tickers} />
    </div>
    
  );
};

export default Post;


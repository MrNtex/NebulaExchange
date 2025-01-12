'use client'

import { CoinAdvanced } from '@/types/coins';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { CoinPrediction } from '@/types/predictions';
import PredictionBox from '@/modules/ai_page/PredictionBox';
import { formatNumber, roundTo } from '@/lib/numberUtils';

export default function Page() {

  const [loading, setLoading] = useState<boolean>(true);
  const [coinInfo, setCoinInfo] = useState<CoinAdvanced | null>(null);
  const [predictionData, setPredictionData] = useState<CoinPrediction | null>(null);

  useEffect(() => {
    console.log('Fetching data from server...');

    const fetchData = async () => {
      setLoading(true);
      const coinData = await fetch(`http://localhost:5000/api/coin/bitcoin`).then((response) =>
        response.json()
      );

      const predictionData = await fetch(`http://localhost:5000/api/prediction/bitcoin`).then((response) =>
        response.json()
      );

      if (coinData && predictionData) {
        console.log(coinData);
        setCoinInfo(coinData);
        setPredictionData(predictionData);
        console.log(predictionData);
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

  if (!coinInfo || !predictionData || !predictionData.predictions || !coinInfo.market_data.current_price?.usd) {
    return <div>Error fetching data</div>;
  }

  function getChange(next: number) {
    if(!coinInfo || !coinInfo.market_data.current_price?.usd) return 0;

    const chg = (coinInfo.market_data.current_price?.usd - next) / coinInfo.market_data.current_price?.usd * 100;
    return chg;
  }

  const weekPrice = predictionData?.predictions[8].predicted_Open;
  const monthPrice = predictionData?.predictions[30].predicted_Open || 0;


  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center gap-2 text-xl font-extralight h-20'>
        <h1>AI Forecast for </h1>
        <a href='/coin/bitcoin' className='flex items-center gap-2'>
          <Image src={coinInfo.image?.small || ''} alt='logo' width={20} height={20} />
          <h2 className='font-normal'>{coinInfo.name}</h2>
        </a>
      </div>
      <div className='flex justify-around gap-4'>
        <PredictionBox title='💚 Today' price={formatNumber(roundTo(coinInfo.market_data.current_price?.usd,2), 'USD')} />
        <PredictionBox title='🪙 Next Week' price={formatNumber(roundTo(weekPrice,2), 'USD')} change={roundTo(getChange(weekPrice),2)}/>
        <PredictionBox title='🔥 Next Month' price={formatNumber(roundTo(monthPrice,2), 'USD')} change={roundTo(getChange(monthPrice),2)}/>
      </div>
      
    </div>
  )
}

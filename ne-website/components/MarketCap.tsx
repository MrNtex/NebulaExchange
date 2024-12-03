import React, { useEffect, useState } from 'react'
import Tile from './Tile'
import ChangeMarker from './ChangeMarker';
import { formatNumber, roundTo } from '@/lib/numberUtils';
import { StackedProgressBar } from './StackedBarChart';
import { Coin, CoinSimple } from '@/types/coins';
import { Skeleton } from './ui/skeleton';

interface MarketCapInfo {
  total_market_cap: {
    usd: number;
  };
  market_cap_change_percentage_24h_usd: number;
}

export default function MarketCap({ topCoins }: { topCoins: Coin[][] }) {
  const [marketcap, setMarketCap] = useState<MarketCapInfo>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchMarketCap = async () => {
      try{
        const data = await fetch('https://api.coingecko.com/api/v3/global');
        if (!data.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await data.json();
        setMarketCap(result.data);
      } catch (error) {
        console.log('Error fetching data', error)
      }
      finally {
        setLoading(false);
      }
    };
    fetchMarketCap();
  }, []);

  if(loading || !marketcap || !topCoins || !Array.isArray(topCoins[0]) ||topCoins[0].length < 3) {
    return (
      <Tile title='Market Cap' className='p-3 pl-8'>
        <div className='items-center justify-between'>
          <Skeleton className="h-[40px] w-[300px] rounded-xl" />
          <div className='flex gap-2 pt-8'>
            <Skeleton className='w-20 h-6  rounded-xl' />
            <Skeleton className='w-20 h-6  rounded-xl' />
            <Skeleton className='w-20 h-6 rounded-xl' />
          </div>
        </div>
      </Tile>
    )
  }

  let topThreeCoins = topCoins[0].slice(0, 3);

  const segments = [
    { color: 'orange', percentage: topThreeCoins[0].market_cap / marketcap.total_market_cap.usd * 100 },
    { color: 'blue', percentage: topThreeCoins[1].market_cap / marketcap.total_market_cap.usd * 100 },
    { color: 'aqua', percentage: topThreeCoins[2].market_cap / marketcap.total_market_cap.usd * 100 },
  ];

  const coinBadge = (coin: CoinSimple) => (
    <div className='flex items-center gap-1 bg-zinc-800 p-1 bg-opacity-25 rounded-lg overflow-hidden'>
      <img src={coin.image} alt={coin.name} className='w-4 h-4'/>
      <p className='text-sm'>{roundTo(coin.market_cap / marketcap.total_market_cap.usd * 100,2)}%</p>
    </div>
  );

  return (
    <Tile title='Market Cap' className='p-3 pl-8'>
      <div>
        <h1 className='text-xl font-bold'>{formatNumber(marketcap?.total_market_cap.usd || 0)}</h1>
        <ChangeMarker change={roundTo(marketcap?.market_cap_change_percentage_24h_usd ?? 0, 3)} className='text-xs text-gray-400'/>
      </div>
      <h1 className='font-semibold py-2'>Dominance</h1>
      <div className='flex gap-2 pb-2'>
        {coinBadge(topThreeCoins[0])}
        {coinBadge(topThreeCoins[1])}
        {coinBadge(topThreeCoins[2])}
      </div>
      
      <StackedProgressBar segments={segments} />
    </Tile>
  )
}

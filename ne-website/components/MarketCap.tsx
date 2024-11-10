import React, { useEffect, useState } from 'react'
import Tile from './Tile'
import ChangeMarker from './ChangeMarker';
import { formatNumber, roundTo } from '@/lib/numberUtils';

interface MarketCapInfo {
  total_market_cap: {
    usd: number;
  };
  market_cap_change_percentage_24h_usd: number;
  market_cap_percentage: {
    [key: string]: number;
  };
}

export default function MarketCap() {
  const [marketcap, setMarketCap] = useState<MarketCapInfo>();

  useEffect(() => {
    const fetchMarketCap = async () => {
      try{
        const data = await fetch('https://api.coingecko.com/api/v3/global');
        if (!data.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await data.json();
        console.log(result);
        setMarketCap(result.data);
      } catch (error) {
        console.log('Error fetching data', error)
      }
    };
    fetchMarketCap();
  }, []);

  return (
    <div>
      <Tile title='Market Cap' className='p-3 pl-8'>
        <div>
          <h1 className='text-xl font-bold'>{formatNumber(marketcap?.total_market_cap.usd || 0)}</h1>
          <ChangeMarker change={roundTo(marketcap?.market_cap_change_percentage_24h_usd ?? 0, 3)} className='text-xs text-gray-400'/>
        </div>
      </Tile>
      <Tile title='Composition'>
        <h1>Market Cap</h1>
      </Tile>
    </div>
  )
}

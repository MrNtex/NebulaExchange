'use client';

import React from 'react'
import Tile from './Tile'
import CryptoBox from './CryptoBox'
import { Skeleton } from './ui/skeleton';
import MarketCap from './MarketCap';
import { Coin } from '@/types/coins';



export default function MainPageHeader() {
  const [cryptoPrices, setCryptoPrices] = React.useState<Coin[][]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    console.log('Fetching data from server...')
    

    const fetchData = async () => {
      setLoading(true);
      const marketCapData = await getPrices('marketcap');
      const volumeData = await getPrices('pricechange');
      const geckoData = await getPrices('volume');

      if (marketCapData && volumeData && geckoData) {
        // Set the state with the array of data fetched
        setCryptoPrices([marketCapData, volumeData, geckoData]);
      }
      setLoading(false);
    };
    fetchData();
    
  }, []);

  const getPrices = async (order: string) => {
    console.log('Fetching data from server for order', order)
  
    try {
      const data = await fetch(`http://localhost:5134/api/coins/${order}`);
      return data.json() as Promise<Coin[]>;
    } catch (error) {
      console.log('Error fetching data', error)
    }
  };

  const ListCoinsInBox: React.FC<{ idx: number }> = ({ idx }) => {
    if (loading) {
      return ( <div className='flex flex-col gap-2 items-center pt-2'>
        <Skeleton className="h-[40px] w-[300px] rounded-xl" />
        <Skeleton className="h-[40px] w-[300px] rounded-xl" />
        <Skeleton className="h-[40px] w-[300px] rounded-xl" />
      </div>);
    }
    return (
      <>
        {cryptoPrices[idx]?.map((coin) => (
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} />
        ))}
      </>
    )
  }
  
  
  

  return (
    <div className='flex justify-around py-4'>
      <Tile title='💸 By Market Cap' className='min-w-80'>
        <ListCoinsInBox idx={0} />
      </Tile>
      <Tile title='🚀 Largest Gainers' className='min-w-80'>
        <ListCoinsInBox idx={1} />
      </Tile>
      <Tile title='🔥 Trending' className='min-w-80'>
        <ListCoinsInBox idx={2} />
      </Tile>
      <MarketCap topCoins={cryptoPrices[0]?.slice(0,3)}/>
    </div>
  )
}

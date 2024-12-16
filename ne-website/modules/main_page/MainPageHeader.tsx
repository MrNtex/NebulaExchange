'use client';

import React from 'react'
import Tile from '../../components/Tile'
import CryptoBox from './CryptoBox'
import { Skeleton } from '../../components/ui/skeleton';
import MarketCap from '../../components/MarketCap';
import { CoinSimple } from '@/types/coins';


export default function MainPageHeader() {
  const [cryptoPrices, setCryptoPrices] = React.useState<CoinSimple[][]>([])
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
      else {
        console.log('Error fetching data')
      }
      setLoading(false);
    };
    fetchData();
    
  }, []);

  const getPrices = async (order: string) => {
    console.log('Fetching data from server for order', order)
  
    try {
      const data = await fetch(`http://localhost:5000/api/listcoins/${order}`);
      if (!data.ok) {
        throw new Error('Failed to fetch data');
      }
      return data.json() as Promise<CoinSimple[]>;
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
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} id={coin.id}/>
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

      <MarketCap topCoins={cryptoPrices}/>
    </div>
  )
}

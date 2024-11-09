'use client';

import React from 'react'
import Tile from './Tile'
import CryptoBox from './CryptoBox'


export default function MainPageHeader() {
  const [cryptoPrices, setCryptoPrices] = React.useState<Coin[][]>([])

  React.useEffect(() => {
    console.log('Fetching data from server...')

    const fetchData = async () => {
      const marketCapData = await getPrices('marketcap');
      const volumeData = await getPrices('pricechange');
      const geckoData = await getPrices('volume');

      if (marketCapData && volumeData && geckoData) {
        // Set the state with the array of data fetched
        setCryptoPrices([marketCapData, volumeData, geckoData]);
      }
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
  
  type Coin = {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    price_change_percentage_24h: number
  }
  

  return (
    <div className='flex justify-around py-4'>
      <Tile title='💸 By Market Cap' className='min-w-80'>
        {cryptoPrices[0]?.map((coin) => (
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} />
        ))}
      </Tile>
      <Tile title='🚀 Largest Gainers' className='min-w-80'>
        {cryptoPrices[1]?.map((coin) => (
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} />
        ))}
      </Tile>
      <Tile title='By Market Cap' className='min-w-80'>
        {cryptoPrices[2]?.map((coin) => (
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} />
        ))}
      </Tile>
    </div>
  )
}

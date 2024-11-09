'use client';

import React from 'react'
import Tile from './Tile'
import CryptoBox from './CryptoBox'


export default function MainPageHeader() {
  const [cryptoPrices, setCryptoPrices] = React.useState<Coin[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getPrices();
      if (!data) return
      setCryptoPrices(data);
    };
    fetchData();
  }, []);

  const getPrices = async () => {
    console.log('Fetching data from server')
  
    try {
      const data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false')
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
  
  console.log('Fetching data from server')
  console.log(cryptoPrices);
  
  return (
    <div className='flex justify-around'>
      <Tile title='By Market Cap' className='min-w-80'>
        {cryptoPrices.map((coin) => (
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} />
        ))}
      </Tile>
      <Tile title='By Market Cap' className='min-w-80'>
        {cryptoPrices.map((coin) => (
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} />
        ))}
      </Tile>
      <Tile title='By Market Cap' className='min-w-80'>
        {cryptoPrices.map((coin) => (
          <CryptoBox key={coin.id} tag={coin.symbol} image={coin.image} currentPrice={coin.current_price} change={coin.price_change_percentage_24h} />
        ))}
      </Tile>
    </div>
  )
}

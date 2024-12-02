import { Coin, CoinAdvanced } from '@/types/coins'
import React from 'react'
import Image from 'next/image'

export default function CoinHeader(coin: CoinAdvanced) {
  return (
    <div>
      <div className='flex items-center justify-center'>
        <Image src={coin.image} alt='logo' width={50} height={50} />
        <div>
          Nebula Exchange
        </div>
      </div>
      <div>
        <div>
          {coin.name}
        </div>
        <div>
          {coin.symbol}
        </div>
      </div>
    </div>
  )
}

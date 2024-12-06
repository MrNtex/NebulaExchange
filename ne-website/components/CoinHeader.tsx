import { Coin, CoinAdvanced } from '@/types/coins'
import React, { useState } from 'react'
import Image from 'next/image'
import ChangeMarker from './ChangeMarker'
import { formatNumber } from '@/lib/numberUtils'
import { CurrencyToggle } from './CurrencyToggle'
import { useCoin } from '@/context/coinContext'
import { Skeleton } from './ui/skeleton'

export default function CoinHeader() {


  const { coin, currency, setCurrency} = useCoin();
  if (!coin) {
    return ( 
    <div>
      <Skeleton className='w-20 h-20 rounded-full'/>
    </div>
    )
  }
  return (
    <div>
      <div className='flex items-center justify-center gap-2'>
        <Image src={typeof coin.image?.large === 'string' ? coin.image.large : '/default-image.png'} alt='logo' width={50} height={50} />
        <div className='text-lg'>
          {coin.name}
          
        </div>
        <div className='p-1 rounded-lg text-sm text-gray-400'>
          {coin.symbol.toUpperCase()}
        </div>
        
      </div>
      <div>
        <div className='text-5xl py-1'>
          {formatNumber(coin.market_data.current_price?.[currency as keyof typeof coin.market_data.current_price] || 0, currency)}
          <ChangeMarker change={coin.market_data.price_change_percentage_24h_in_currency?.[currency  as keyof typeof coin.market_data.current_price] || 0} className='text-xs text-gray-400 p-1'/>
          
        </div>
        <CurrencyToggle onSelect={(val) => setCurrency(val)}/>
        
      </div>
    </div>
  )
}

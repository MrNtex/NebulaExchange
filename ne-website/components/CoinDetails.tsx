import { useCoin } from '@/context/coinContext'
import { formatNumber } from '@/lib/numberUtils'
import { CoinAdvanced, Currencies } from '@/types/coins'
import { Info } from 'lucide-react'
import { title } from 'process'
import React from 'react'

export default function CoinDetails() {

  const coinContext = useCoin();

  const coin: CoinAdvanced = coinContext.coin as CoinAdvanced;
  const currency = coinContext.currency;

  const numericalData = (title: string, value: number) => {
    return (
      <div className='flex justify-between w-full p-2 px-4'>
        <div>
          <span className=' text-gray-400'>{title}: </span>
          <Info className='inline-block ' color='#c4c4c4' size={16} />
        </div>
        
        {formatNumber(value, currency)}
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col justify-between'>
        {numericalData('Market Cap', coin.market_data.market_cap?.[currency] || 0)}
        {numericalData('Total Volume', coin.market_data.total_volume?.[currency] || 0)}
        {numericalData('Circulating Supply', coin.market_data.circulating_supply || 0)}
        {numericalData('Total Supply', coin.market_data.total_supply || 0)}
        {numericalData('Max Supply', coin.market_data.max_supply || 0)}
      </div>
    </div>
  )
}

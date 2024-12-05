import { useCoin } from '@/context/coinContext'
import { formatNumber } from '@/lib/numberUtils'
import { CoinAdvanced, Currencies } from '@/types/coins'
import { Info } from 'lucide-react'
import { title } from 'process'
import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

export default function CoinDetails() {

  const coinContext = useCoin();

  const coin: CoinAdvanced = coinContext.coin as CoinAdvanced;
  const currency = coinContext.currency as keyof Currencies;

  const numericalData = (title: string, value: number, useCurrency: boolean = false) => {
    return (
      <div className='flex justify-between items-center w-full p-2 px-4'>
        <HoverCard openDelay={100} closeDelay={100}>
          <div className='flex  items-center gap-1'>
            <span className=' text-gray-400 text-center'>{title}: </span>
            <HoverCardTrigger>
              <div className='hover:bg-opacity-70 bg-opacity-0 bg-zinc-800 flex items-center justify-center p-2 rounded-md  transition-all ease-in-out duration-300'>
                <Info className='inline-block ' color='#c4c4c4' size={16} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent side={"top"}>
              The React Framework – created and maintained by @vercel.
            </HoverCardContent>
          </div>
        </HoverCard>
        {useCurrency ? formatNumber(value, currency) : formatNumber(value)}
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col justify-between'>
        {numericalData('Market Cap', coin.market_data.market_cap?.[currency] || 0, true)}
        {numericalData('Total Volume', coin.market_data.total_volume?.[currency] || 0, true)}
        {numericalData('Circulating Supply', coin.market_data.circulating_supply || 0)}
        {numericalData('Total Supply', coin.market_data.total_supply || 0)}
        {numericalData('Max Supply', coin.market_data.max_supply || 0)}
      </div>
    </div>
  )
}

import { Badge } from '@/components/ui/badge';
import { useCoin } from '@/context/coinContext';
import React from 'react'

export default function CoinOverview() {
  const { coin } = useCoin();
  return (
    <div className='overflow-x-auto'>
      <h1 className='text-3xl font-extralight'>{coin?.name}</h1>
      <div className='flex items-center mt-2 gap-4'>
        {coin?.categories?.slice(0,3).map((category, index) => (
          <Badge key={index} className='mr-2'  variant="outline">
            {category}
          </Badge>
        ))}
      </div>
      <p className='text-gray-500'>
        {coin?.description?.en}
      </p>
    </div>
  )
}

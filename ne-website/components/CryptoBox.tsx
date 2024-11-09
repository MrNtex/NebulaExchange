import React from 'react'
import Tile from './Tile'
import Image from 'next/image'

interface CryptoBoxProps {
  title: string
  symbol: string
  currentPrice: number
  change: number
}

export default function CryptoBox(props: CryptoBoxProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Image src={props.symbol} width={50} height={50} alt={`${props.symbol} icon`} />
      </div>
      <div>
        <p className='text-2xl font-semibold'>{props.currentPrice}</p>
        <p className='text-sm text-gray-400'>{props.change}</p>
      </div>
    </div>
  )
}

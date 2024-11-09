import React from 'react'
import Tile from './Tile'
import Image from 'next/image'

interface CryptoBoxProps {
  tag: string
  image: string
  currentPrice: number
  change: number
}

export default function CryptoBox(props: CryptoBoxProps) {
  return (
    <a href={`/coin/${props.tag}`} 
      className='flex items-center justify-between px-4 py-1 hover:py-2 bg-black bg-opacity-0 hover:bg-opacity-60 transition-bg-opacity ease-in-out duration-300'
    >
      <div className='flex items-center'>
        <div>
          <Image src={props.image} width={20} height={20} alt={`${props.tag} icon`} />
        </div>
        <p className='ml-2 text-lg'>{props.tag.toUpperCase()}</p>
      </div>
      
      <div className='text-right right-0'>
        <p className='text-lg font-semibold'>{props.currentPrice}</p>
        <p className='text-xs text-gray-400'>{props.change}</p>
      </div>
    </a>
  )
}

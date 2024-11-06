import React from 'react'
import Tile from './Tile'
import { fetchCoinPrice } from '@/actions/CryptoPrices'

export default function MainPageHeader() {
  return (
    <div className='flex'>
      <Tile title='🔲 By volume'>
        {fetchCoinPrice("BTC")}
      </Tile>
    </div>
  )
}

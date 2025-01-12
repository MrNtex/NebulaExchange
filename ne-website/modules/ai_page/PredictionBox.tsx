import ChangeMarker from '@/components/ChangeMarker';
import Tile from '@/components/Tile'
import React from 'react'

interface PredictionBoxProps {
  title: string;
  price: string | number;
  change?: number;
}

export default function PredictionBox({ title, price, change }: PredictionBoxProps) {
  return (
    <Tile title={title}>
      <div className='flex flex-col gap-4 p-4'>
        <div className='flex items-center gap-2 '>
          <h1 className='text-xl font-semibold'>
            {price}
          </h1>
          {change &&
            <ChangeMarker change={change} />
          }
        </div>
      </div>
    </Tile>
  )
}

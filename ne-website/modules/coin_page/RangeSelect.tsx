import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { Scales, useCoin } from '@/context/coinContext'
import { ToggleGroup } from '@radix-ui/react-toggle-group'
import React from 'react'


export default function RangeSelect() {
  const { scale, setScale } = useCoin();

  return (
    <div className='w-full rounded-md bg-zinc-900 bg-opacity-60 flex justify-evenly items-center'>
      <ToggleGroup type="single" defaultValue={scale} onValueChange={(e: Scales) => setScale(e)} className="w-full flex p-1 gap-2">
        <ToggleGroupItem value="1d" className='flex-1 text-center text-xs p-1 h-4'>1D</ToggleGroupItem>
        <ToggleGroupItem value="7d" className='flex-1 text-center text-xs p-1 h-4'>7D</ToggleGroupItem>
        <ToggleGroupItem value="30d" className='flex-1 text-center text-xs p-1 h-4'>1M</ToggleGroupItem>
        <ToggleGroupItem value="90d" className='flex-1 text-center text-xs p-1 h-4'>90D</ToggleGroupItem>
        <ToggleGroupItem value="365d" className='flex-1 text-center text-xs p-1 h-4'>1Y</ToggleGroupItem>
      </ToggleGroup>

    </div>
  )
}


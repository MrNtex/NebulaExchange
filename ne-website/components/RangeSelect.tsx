import { ToggleGroup } from '@radix-ui/react-toggle-group'
import React from 'react'
import { ToggleGroupItem } from './ui/toggle-group'

export default function RangeSelect() {
  return (
    <div className='w-full rounded-md bg-zinc-900 bg-opacity-60 flex justify-evenly items-center'>
      <ToggleGroup type="single" defaultValue="1d" className="w-full flex p-1 gap-2">
        <ToggleGroupItem value="1d" className='flex-1 text-center text-xs p-1 h-4'>1D</ToggleGroupItem>
        <ToggleGroupItem value="7d" className='flex-1 text-center text-xs p-1 h-4'>7D</ToggleGroupItem>
        <ToggleGroupItem value="1m" className='flex-1 text-center text-xs p-1 h-4'>1M</ToggleGroupItem>
        <ToggleGroupItem value="1y" className='flex-1 text-center text-xs p-1 h-4'>1Y</ToggleGroupItem>
        <ToggleGroupItem value="max" className='flex-1 text-center text-xs p-1 h-4'>MAX</ToggleGroupItem>
      </ToggleGroup>

    </div>
  )
}

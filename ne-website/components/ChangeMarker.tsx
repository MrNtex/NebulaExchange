import { formatNumber, roundTo } from '@/lib/numberUtils';
import React from 'react'

interface ChangeMarkerProps {
  change: number;
  value?: number;
  className?: string;
}

export default function ChangeMarker({ change, value, className }: ChangeMarkerProps) {
  if (change > 0) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <p className='text-green-500'>▲</p>
        <p className='text-green-500'>{roundTo(change, 2)}%</p>
        {value && <p className='text-green-500'>  ({formatNumber(roundTo(value, 2), "USD")})</p>}
      </div>
    )
  }
  else if (change < 0) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <p className='text-red-500'>▼</p>
        <p className='text-red-500'>{roundTo(change, 2)}%</p>
        {value && <p className='text-red-500'>  ({formatNumber(roundTo(value, 2), "USD")})</p>}
      </div>
    )
  }
  else {
    return (
      <div className={`flex gap-1 ${className}`}>
        <p className='text-gray-500'>=</p>
        <p className='text-gray-500'>{change}%</p>
      </div>
    )
  }
}

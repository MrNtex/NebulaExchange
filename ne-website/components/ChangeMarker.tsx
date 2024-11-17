import React from 'react'

interface ChangeMarkerProps {
  change: number;
  color?: boolean;
  className?: string;
}

export default function ChangeMarker({ change, color, className }: ChangeMarkerProps) {
  if (change > 0) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <p className='text-green-500'>▲</p>
        <p className='text-green-500'>{change}%</p>
      </div>
    )
  }
  else if (change < 0) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <p className='text-red-500'>▼</p>
        <p className='text-red-500'>{change}%</p>
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

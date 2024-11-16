import React from 'react'

interface ChangeMarkerProps {
  change: number;
  color?: boolean;
  className?: string;
}

export default function ChangeMarker({ change, color, className }: ChangeMarkerProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {change > 0 ? <p className='text-green-500'>▲</p> : <p className='text-red-500'>▼</p>}
      <p className={`${color ? (change > 0 ? 'text-green-500' : 'text-red-500') : ''}`}>{change}%</p>
    </div>
  )
}

import React from 'react'

interface ChangeMarkerProps {
  change: number;
  className?: string;
}

export default function ChangeMarker({ change, className }: ChangeMarkerProps) {
  return (
    <div className={`flex justify-end gap-1 ${className}`}>
      {change > 0 ? <p className='text-green-500'>▲</p> : <p className='text-red-500'>▼</p>}
      <p>{change}%</p>
    </div>
  )
}

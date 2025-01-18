import { Star } from 'lucide-react'
import React from 'react'
import AddToPortfolioCard from './AddToPortfolioCard'

export default function AddToPortfolioButton() {
  return (
    <div className='w-full flex items-center justify-center p-3'>
      <AddToPortfolioCard/>
      <button className='flex items-center justify-center text-white bg-zinc-900 p-2 border-2 rounded-md w-full gap-2 hover:bg-zinc-800 active:bg-zinc-950 bg-opacity-80 hover:transition-all ease-in-out duration-300'>
        <Star/>
        Add To Portfolio
      </button>
    </div>
    
  )
}

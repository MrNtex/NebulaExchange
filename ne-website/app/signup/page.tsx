import { HeroTitle } from '@/components/HeroTitle'
import SignUp from '@/components/signup'
import Tile from '@/components/Tile'


import React from 'react'

export default function page() {
  return (
    <div className='flex justify-around mx-24 items-center h-screen'>
      <HeroTitle />
      <Tile>
        <div className=''>
          <SignUp/>
        </div>
        
      </Tile>
    </div>
  )
}

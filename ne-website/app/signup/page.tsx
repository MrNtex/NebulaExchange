import { HeroTitle } from '@/components/HeroTitle'
import SignUp from '@/components/signup'
import Tile from '@/components/Tile'


import React from 'react'

export default function page() {
  return (
    <div className='mt-[15%] flex'>
      <HeroTitle />
      <Tile>
        <SignUp/>
      </Tile>
    </div>
  )
}

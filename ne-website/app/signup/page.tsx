'use client'

import { HeroTitle } from '@/components/HeroTitle'
import SignUp from '@/modules/signup/signup'
import Tile from '@/components/Tile'


import React from 'react'
import SignIn from '@/modules/signup/SignIn'

export default function page() {
  const [signUp, setSignUp] = React.useState(true)


  return (
    <div className='flex justify-around mx-24 items-center h-full pt-20'>
      <div>
        <HeroTitle/>
      </div>
      
      <Tile className='w-2/3'>
        <div className=''>
          {signUp ? <SignUp/> : <SignIn/>}
        </div>
        <div className='flex justify-center'>
          <button onClick={() => setSignUp(!signUp)}>{signUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}</button>
        </div>
        
      </Tile>
    </div>
  )
}

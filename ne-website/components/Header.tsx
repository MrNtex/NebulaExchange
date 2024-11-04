'use client'

import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/authcontext'

export default function Header() {
  const { user, userDataObj} = useAuth()

  const Right = () => {
    if (user) {
      return (
        <div>
          {userDataObj?.name}
          Logout
        </div>
      )
    }
    return (
      <div className='flex items-center'>
        Login
      </div>
    )
  }

  return (
    <div className='w-full top-0 fixed bg-black flex justify-between'>
        <a href='./' className='flex items-center justify-center'>
            <Image src='/Nebula_exchange_logo.png' alt='logo' width={50} height={50} />
            <div>
                Nebula Exchange
            </div>
        </a>
        <div>
          <Right/>
        </div>
    </div>
  )
}

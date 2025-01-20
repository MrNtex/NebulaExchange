'use client'

import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/authcontext'
import { MenuBar } from './MenuBar'
import { DoorClosedIcon } from 'lucide-react'

export default function Header() {
  const { user, userDataObj, logout } = useAuth()

  const Right = () => {
    if (user) {
      return (
        <div className='flex items-center gap-4 h-full p-2 pr-6'>
          <a href='/dashboard'>{userDataObj?.name}</a>
          <button onClick={logout}>Logout</button>
        </div>
      )
    }
    return (
      <a href='/login' className='flex items-center h-full p-2 pr-6'>
        <DoorClosedIcon size={24} />
        <h1>Sign Up</h1>
      </a>
    )
  }

  return (
    <div className='w-full top-0 bg-black flex justify-between'>
        <a href='./' className='flex items-center justify-center'>
            <Image src='/Nebula_exchange_logo.png' alt='logo' width={50} height={50} />
            <div>
                Nebula Exchange
            </div>
        </a>
        <MenuBar/>
        <div>
          <Right/>
        </div>
    </div>
  )
}

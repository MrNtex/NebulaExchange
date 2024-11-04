import React from 'react'
import Image from 'next/image'

export default function Header() {
  return (
    <div className='w-full top-0 fixed bg-black flex justify-between'>
        <a href='./' className='flex items-center justify-center'>
            <Image src='/Nebula_exchange_logo.png' alt='logo' width={50} height={50} />
            <div>
                Nebula Exchange
            </div>
        </a>
        <div>
            Login
        </div>
    </div>
  )
}

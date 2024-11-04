import { AuthProvider } from '@/context/authcontext'
import React from 'react'

export default function Main(props: { children: any }) {
  const {children} = props

  return (
    <main>
        <AuthProvider>
            {children}
        </AuthProvider>
    </main>
  )
}

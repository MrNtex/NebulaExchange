'use client';
import React, {useActionState, useEffect, useState} from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useAuth } from '@/context/authcontext';
import { login } from '@/actions/auth';

import { SignInFormState } from '@/lib/definitions';

export default function SignUp() {
    
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, userDataObj, login } = useAuth()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className='p-3'>
      <form onSubmit={onSubmit} className='flex flex-col gap-5'>
        <h1 className='text-2xl'>Sign In 💸</h1>
        <div>
          <Label>Username</Label>
          <Input onInput={(e) => setEmail(e.currentTarget.value)} placeholder='Username' name="username"/>
        </div>
        <div >
          <Label>Password</Label>
          <Input onInput={(e) => setPassword(e.currentTarget.value)} placeholder='Password' type='password' name="password"/>
        </div>
        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded mt-2 justify-center items-center w-full' type='submit'>
          Sign In
        </Button>
      </form>
    </div>
    
  )
}

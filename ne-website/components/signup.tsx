'use client';
import React, {useActionState, useEffect, useState} from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom';

import { signup } from '@/actions/auth'
import { useAuth } from '@/context/authcontext';

export default function SignUp() {
    
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [state, action] = useActionState(signup, undefined)

  return (
    <div className='p-3 w-96'>
      <form action={action} className='flex flex-col gap-5'>
        <h1 className='text-2xl'>Sign In 🚀</h1>
        <div>
          <Label>Username</Label>
          <Input placeholder='Username' name="username"/>
        </div>
        <div>
        <Label>Email</Label>
        <Input placeholder='Email' type='email' name="email"/>
        {state?.errors?.email && <p>{state.errors.email}</p>}
        </div>
        <div >
        <Label>Password</Label>
        <Input placeholder='Password' type='password' name="password"/>
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        </div>
        <div>
        <Label>Confirm Password</Label>
        <Input placeholder='Confirm Password' type='password' name="confirmpassword"/>
        
        </div>
        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded mt-2 justify-center items-center w-full' type='submit'>
          Sign In
        </Button>
      </form>
    </div>
    
  )
}

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
    <form action={action}>
        <h1>Sign In 🚀</h1>
        <Label>Username</Label>
        <Input placeholder='Username' name="username"/>
        <Label>Email</Label>
        <Input placeholder='Email' type='email' name="email"/>
        {state?.errors?.email && <p>{state.errors.email}</p>}
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
        <Label>Confirm Password</Label>
        <Input placeholder='Confirm Password' type='password' name="confirmpassword"/>
        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2' type='submit'>
          Sign In
        </Button>
    </form>
  )
}

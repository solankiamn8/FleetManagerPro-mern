import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('driver')
  const { register } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      await register({ name, email, password, role })
      nav('/login')
    }catch(e){
      alert('Registration failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <form onSubmit={submit} className='w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow'>
        <h2 className='text-2xl mb-4'>Create account</h2>
        <label className='block mb-2'>Name
          <input value={name} onChange={e=>setName(e.target.value)} className='w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700' />
        </label>
        <label className='block mb-2'>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} className='w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700' />
        </label>
        <label className='block mb-2'>Role
          <select value={role} onChange={e=>setRole(e.target.value)} className='w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700'>
            <option value='driver'>Driver</option>
            <option value='manager'>Manager</option>
            <option value='admin'>Admin</option>
          </select>
        </label>
        <label className='block mb-4'>Password
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} className='w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700' />
        </label>
        <button className='w-full py-2 bg-green-600 text-white rounded'>Register</button>
      </form>
    </div>
  )
}

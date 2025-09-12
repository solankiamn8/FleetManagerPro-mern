import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      await login(email, password)
      nav('/')
    }catch(e){
      setErr(e.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <form onSubmit={submit} className='w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow'>
        <h2 className='text-2xl mb-4'>Sign in</h2>
        {err && <div className='text-red-500 mb-2'>{err}</div>}
        <label className='block mb-2'>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} className='w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700' />
        </label>
        <label className='block mb-4'>Password
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} className='w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700' />
        </label>
        <button className='w-full py-2 bg-blue-600 text-white rounded'>Login</button>
        <div className='mt-3 text-sm'>
          <Link to='/register' className='text-blue-600'>Create an account</Link>
        </div>
      </form>
    </div>
  )
}

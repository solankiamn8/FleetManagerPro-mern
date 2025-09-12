import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Topbar(){
  const { user, logout } = useAuth()
  return (
    <header className='flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700'>
      <div className='flex items-center gap-3'>
        <h3 className='text-lg font-semibold'>FleetManagerPro</h3>
      </div>
      <div className='flex items-center gap-4'>
        <button title='Toggle dark mode' onClick={() => document.documentElement.classList.toggle('dark')} className='p-2 rounded'>🌓</button>
        {user ? (
          <div className='flex items-center gap-3'>
            <div>{user.name || user.email} <span className='text-xs text-gray-500'>({user.role})</span></div>
            <button onClick={logout} className='px-3 py-1 bg-red-500 text-white rounded'>Logout</button>
          </div>
        ) : null}
      </div>
    </header>
  )
}

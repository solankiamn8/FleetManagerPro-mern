import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RequireRole({ role, children }){
  const { user } = useAuth()
  if(!user) return <Navigate to='/login' replace/>
  if(role && user.role !== role && user.role !== 'admin'){
    return <div className='p-4 text-red-500'>Access denied — requires {role} role</div>
  }
  return children
}

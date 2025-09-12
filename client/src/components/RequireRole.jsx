import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function RequireRole({ role, children }){
  const { user } = useAuth()
  if(!user) return <Navigate to='/login' />
  if(role && user.role !== role && user.role !== 'admin'){
    return <div className='p-4 text-red-500'>Access denied — requires {role} role</div>
  }
  return children
}

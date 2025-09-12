import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  return (
    <div className='min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <Sidebar />
      <div className='flex-1'>
        <Topbar />
        <main className='p-4'>
          <Outlet /> {/* Nested route pages will render here */}
        </main>
      </div>
    </div>
  )
}

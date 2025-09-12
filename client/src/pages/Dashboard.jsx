import React from 'react'
import QuickStats from '../sections/QuickStats'
import RecentActivity from '../sections/RecentActivity'
import Charts from '../sections/Charts'
import PanicCard from '../sections/PanicCard'

export default function Dashboard(){
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Welcome to FleetManagerPro</h1>
      <QuickStats />
      <div className='grid md:grid-cols-3 gap-4'>
        <Charts />
        <PanicCard />
      </div>
      <RecentActivity />
    </div>
  )
}

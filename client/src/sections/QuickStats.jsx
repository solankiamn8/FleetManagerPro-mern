import React from 'react'
export default function QuickStats(){
  const stats = [
    { label: 'Vehicles', value: 42 },
    { label: 'Active Trips', value: 6 },
    { label: 'Maintenance Due', value: 4 },
    { label: 'Drivers', value: 18 },
  ]
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {stats.map(s=>(
        <div key={s.label} className='p-4 bg-white dark:bg-gray-800 rounded shadow'>
          <div className='text-sm text-gray-500'>{s.label}</div>
          <div className='text-2xl font-bold'>{s.value}</div>
        </div>
      ))}
    </div>
  )
}

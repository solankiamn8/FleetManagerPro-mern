import React from 'react'
export default function RecentActivity(){
  const items = ['Vehicle TR-102 completed inspection', 'Driver John completed trip #342', 'Maintenance scheduled for TR-12']
  return (
    <div className='p-4 bg-white dark:bg-gray-800 rounded shadow'>
      <h3 className='font-semibold mb-2'>Recent activity</h3>
      <ul className='list-disc pl-5'>
        {items.map(i=> <li key={i}>{i}</li>)}
      </ul>
    </div>
  )
}

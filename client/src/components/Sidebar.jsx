import React from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon, TruckIcon, UserGroupIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

const items = [
  { to: '/', label: 'Dashboard', icon: HomeIcon },
  { to: '/vehicles', label: 'Vehicles', icon: TruckIcon },
  { to: '/drivers', label: 'Drivers', icon: UserGroupIcon },
  { to: '/maintenance', label: 'Maintenance', icon: CalendarIcon },
  { to: '/geofence', label: 'Geofencing', icon: MapPinIcon },
]

export default function Sidebar(){
  return (
    <aside className='w-64 bg-white dark:bg-gray-800 shadow p-4 hidden md:block'>
      <h2 className='text-xl font-bold mb-6'>FleetManagerPro</h2>
      <nav>
        {items.map(it => (
          <Link key={it.to} to={it.to} className='flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700'>
            <it.icon className='w-5 h-5' />
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

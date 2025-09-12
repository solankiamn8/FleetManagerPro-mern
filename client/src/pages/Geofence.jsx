import React, { useState } from 'react'

export default function Geofence(){
  const [zones, setZones] = useState([{ id:1, name:'Warehouse A', radius: 500, lat: 12.97, lng: 77.59 }])
  const [newZone, setNewZone] = useState({ name:'', radius:100, lat:'', lng:'' })

  const add = (e) => {
    e.preventDefault()
    setZones([...zones, { ...newZone, id: Date.now() }])
    setNewZone({ name:'', radius:100, lat:'', lng:'' })
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Geofencing (mock)</h2>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='bg-white dark:bg-gray-800 p-4 rounded shadow'>
          <h3 className='font-semibold mb-2'>Zones</h3>
          <ul className='space-y-2'>
            {zones.map(z=> <li key={z.id} className='p-2 border rounded'>{z.name} — r:{z.radius}m — {z.lat},{z.lng}</li>)}
          </ul>
        </div>
        <form onSubmit={add} className='bg-white dark:bg-gray-800 p-4 rounded shadow'>
          <h3 className='font-semibold mb-2'>Add zone</h3>
          <label>Name<input value={newZone.name} onChange={e=>setNewZone({...newZone, name:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
          <label>Radius<input type='number' value={newZone.radius} onChange={e=>setNewZone({...newZone, radius:parseInt(e.target.value||0)})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
          <label>Lat<input value={newZone.lat} onChange={e=>setNewZone({...newZone, lat:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
          <label>Lng<input value={newZone.lng} onChange={e=>setNewZone({...newZone, lng:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
          <button className='mt-3 px-3 py-1 bg-green-600 text-white rounded'>Add Zone</button>
        </form>
      </div>
    </div>
  )
}

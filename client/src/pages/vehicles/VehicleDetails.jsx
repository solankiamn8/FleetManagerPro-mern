import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function VehicleDetails(){
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    api.get('/vehicles/' + id).then(res => setVehicle(res.data)).catch(()=>{})
  }, [id])

  const remove = async () => {
    if(!confirm('Delete vehicle?')) return
    try{
      await api.delete('/vehicles/' + id)
      nav('/vehicles')
    }catch(e){ alert('Failed to delete (mock)') }
  }

  if(!vehicle) return <div>Loading...</div>

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>{vehicle.registration}</h2>
        <div className='flex gap-2'>
          <Link to={`/vehicles/${id}/edit`} className='px-3 py-1 bg-yellow-500 text-white rounded'>Edit</Link>
          <button onClick={remove} className='px-3 py-1 bg-red-600 text-white rounded'>Delete</button>
        </div>
      </div>
      <div className='p-4 bg-white dark:bg-gray-800 rounded shadow'>
        <div><strong>Model:</strong> {vehicle.model}</div>
        <div><strong>Status:</strong> {vehicle.status}</div>
        <div><strong>Last known:</strong> {vehicle.lastLocation ? `${vehicle.lastLocation.lat}, ${vehicle.lastLocation.lng}` : '—'}</div>
      </div>
      <div className='p-4 bg-white dark:bg-gray-800 rounded shadow'>
        <h3 className='font-semibold mb-2'>Simulated Map</h3>
        <div className='w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>Map placeholder</div>
      </div>
    </div>
  )
}

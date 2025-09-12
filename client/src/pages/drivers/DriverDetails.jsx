import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'

export default function DriverDetails(){
  const { id } = useParams()
  const [driver, setDriver] = useState(null)

  useEffect(()=> {
    api.get('/drivers/'+id).then(res=> setDriver(res.data)).catch(()=>{})
  }, [id])

  if(!driver) return <div>Loading...</div>

  return (
    <div>
      <h2 className='text-xl font-semibold'>{driver.name}</h2>
      <div className='p-4 bg-white dark:bg-gray-800 rounded shadow'>
        <div><strong>Email:</strong> {driver.email}</div>
        <div><strong>Assigned vehicle:</strong> {driver.vehicle || '—'}</div>
        <div><strong>Trips:</strong> {driver.trips?.length || 0}</div>
      </div>
      <div className='p-4 bg-white dark:bg-gray-800 rounded shadow mt-4'>
        <h3 className='font-semibold mb-2'>Performance (mock)</h3>
        <div>Rating: {driver.rating || '4.5'}</div>
      </div>
    </div>
  )
}

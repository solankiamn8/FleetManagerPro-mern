import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function Drivers(){
  const [drivers, setDrivers] = useState([])
  useEffect(() => {
    api.get('/drivers').then(res=> setDrivers(res.data || [])).catch(()=>{})
  }, [])

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Drivers</h2>
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        {drivers.map(d=>(
          <Link to={'/drivers/'+(d._id||d.id)} key={d._id||d.id} className='p-4 bg-white dark:bg-gray-800 rounded shadow'>
            <div className='font-semibold'>{d.name}</div>
            <div className='text-sm text-gray-500'>Trips: {d.tripsCount || 0}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

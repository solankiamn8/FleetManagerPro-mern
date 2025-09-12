import React, { useEffect, useState } from 'react'
import api from '../../services/api'

function Day({ d, items }) {
  return (
    <div className='border p-2 min-h-20'>
      <div className='text-sm font-semibold'>{d}</div>
      <ul className='text-xs'>
        {items.map(it=> <li key={it._id||it.id}>{it.vehicleRegistration || it.vehicle} - ${it.estimate||0}</li>)}
      </ul>
    </div>
  )
}

export default function Maintenance(){
  const [items, setItems] = useState([])
  useEffect(()=> {
    api.get('/maintenance').then(res=> setItems(res.data || [])).catch(()=>{})
  }, [])

  // group by day (mock)
  const grouped = {}
  items.forEach(it => {
    const day = new Date(it.dueDate).getDate() || new Date().getDate()
    grouped[day] = grouped[day] || []
    grouped[day].push(it)
  })
  const days = Array.from({length:7}, (_,i)=> i+1)

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Maintenance Schedule</h2>
      <div className='grid grid-cols-7 gap-2'>
        {days.map(d => <Day key={d} d={d} items={grouped[d]||[]} />)}
      </div>
    </div>
  )
}

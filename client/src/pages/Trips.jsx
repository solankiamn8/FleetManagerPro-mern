import React, { useState, useEffect } from 'react'
import api from './services/api'  // note: relative path corrected below

export default function Trips(){
  const [form, setForm] = useState({ vehicleId:'', start:'', end:'', notes:'' })

  const submit = async (e) => {
    e.preventDefault()
    try{
      await api.post('/trips', form)
      alert('Trip logged')
      setForm({ vehicleId:'', start:'', end:'', notes:'' })
    }catch(e){
      alert('Failed to log trip')
    }
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Log a Trip</h2>
      <form onSubmit={submit} className='bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3'>
        <label>Vehicle ID<input value={form.vehicleId} onChange={e=>setForm({...form, vehicleId:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
        <label>Start<input value={form.start} onChange={e=>setForm({...form, start:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
        <label>End<input value={form.end} onChange={e=>setForm({...form, end:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
        <label>Notes<textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
        <button className='px-3 py-1 bg-blue-600 text-white rounded'>Submit</button>
      </form>
    </div>
  )
}

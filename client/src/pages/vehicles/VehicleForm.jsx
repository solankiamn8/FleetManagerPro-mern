import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

export default function VehicleForm({ edit }){
  const [form, setForm] = useState({ registration:'', model:'', status:'active', lastLocation: {lat:'', lng:''} })
  const { id } = useParams()
  const nav = useNavigate()

  useEffect(() => {
    if(edit && id){
      api.get('/vehicles/'+id).then(res => setForm(res.data)).catch(()=>{})
    }
  }, [edit, id])

  const submit = async (e) => {
    e.preventDefault()
    try{
      if(edit) await api.put('/vehicles/'+id, form)
      else await api.post('/vehicles', form)
      nav('/vehicles')
    }catch(e){
      alert('Failed to save (mock)')
    }
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>{edit ? 'Edit' : 'Add'} Vehicle</h2>
      <form onSubmit={submit} className='bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3'>
        <label>Registration<input value={form.registration} onChange={e=>setForm({...form, registration:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
        <label>Model<input value={form.model} onChange={e=>setForm({...form, model:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
        <label>Status
          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700'>
            <option value='active'>Active</option>
            <option value='maintenance'>Maintenance</option>
            <option value='inactive'>Inactive</option>
          </select>
        </label>
        <div className='grid grid-cols-2 gap-2'>
          <label>Lat<input value={form.lastLocation?.lat} onChange={e=>setForm({...form, lastLocation:{...form.lastLocation, lat:e.target.value}})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
          <label>Lng<input value={form.lastLocation?.lng} onChange={e=>setForm({...form, lastLocation:{...form.lastLocation, lng:e.target.value}})} className='w-full p-2 mt-1 rounded bg-gray-50 dark:bg-gray-700' /></label>
        </div>
        <button className='px-3 py-1 bg-blue-600 text-white rounded'>{edit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  )
}

import React from 'react'
import api from '../services/api'

export default function PanicCard(){
  const panic = async () => {
    try{
      // mock call
      await api.post('/alerts/panic', { time: new Date().toISOString() })
      alert('Panic alert sent (mock)')
    }catch(e){
      alert('Failed to send panic. This is a mock in dev.')
    }
  }

  return (
    <div className='p-4 bg-white dark:bg-gray-800 rounded shadow'>
      <h3 className='font-semibold mb-2'>Emergency</h3>
      <p className='text-sm mb-3'>Panic button to send emergency alert to operations.</p>
      <button onClick={panic} className='px-4 py-2 bg-red-600 text-white rounded'>PANIC</button>
    </div>
  )
}

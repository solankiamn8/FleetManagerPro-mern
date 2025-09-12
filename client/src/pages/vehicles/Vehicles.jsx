import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'

export default function Vehicles(){
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    let mounted = true
    api.get('/vehicles').then(res=>{
      if(mounted) setVehicles(res.data || [])
    }).catch(()=>{})
    return ()=> mounted=false
  }, [])

  const exportCSV = () => {
    const csv = [
      ['id,registration,model,status'],
      ...vehicles.map(v => `${v._id || v.id},${v.registration},${v.model},${v.status}`)
    ].join('\n')
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
    saveAs(blob, 'vehicles.csv')
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text('Vehicles', 10, 10)
    vehicles.forEach((v,i)=> doc.text(`${i+1}. ${v.registration} — ${v.model} — ${v.status}`, 10, 20 + i*8))
    doc.save('vehicles.pdf')
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Vehicles</h2>
        <div className='flex gap-2'>
          <Link to='/vehicles/new' className='px-3 py-1 bg-green-600 text-white rounded'>Add Vehicle</Link>
          <button onClick={exportCSV} className='px-3 py-1 bg-gray-200 rounded'>Export CSV</button>
          <button onClick={exportPDF} className='px-3 py-1 bg-gray-200 rounded'>Export PDF</button>
        </div>
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        {vehicles.map(v=>(
          <Link to={'/vehicles/'+(v._id || v.id)} key={v._id || v.id} className='p-4 bg-white dark:bg-gray-800 rounded shadow block'>
            <div className='flex justify-between'>
              <div>
                <div className='font-semibold'>{v.registration || '—'}</div>
                <div className='text-sm text-gray-500'>{v.model || 'Unknown'}</div>
              </div>
              <div className='text-sm'>{v.status || 'active'}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

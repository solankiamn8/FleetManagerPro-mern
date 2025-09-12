import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function Charts(){
  const data = { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Miles driven', data: [120,200,150,170,180,220,190], fill:false, tension:0.3 }] }
  return (
    <div className='md:col-span-2 p-4 bg-white dark:bg-gray-800 rounded shadow'>
      <h3 className='font-semibold mb-2'>Weekly mileage</h3>
      <Line data={data} />
    </div>
  )
}

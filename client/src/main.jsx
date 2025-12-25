import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import "leaflet/dist/leaflet.css"
import "./utils/fixLeafLetIcons"



createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <div className='font-sans'>
          <App />
        </div>
      </BrowserRouter>
    </AuthProvider>
  // </React.StrictMode>
)

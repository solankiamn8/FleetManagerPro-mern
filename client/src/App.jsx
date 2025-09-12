import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/vehicles/Vehicles'
import VehicleDetails from './pages/vehicles/VehicleDetails'
import VehicleForm from './pages/vehicles/VehicleForm'
import Drivers from './pages/drivers/Drivers'
import DriverDetails from './pages/drivers/DriverDetails'
import Maintenance from './pages/maintenance/Maintenance'
import Trips from './pages/Trips'
import Geofence from './pages/Geofence'
import Layout from './components/Layout'
import { useAuth } from './context/AuthContext'
import RequireRole from './components/RequireRole'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="vehicles/new" element={<RequireRole role="manager"><VehicleForm /></RequireRole>} />
        <Route path="vehicles/:id" element={<VehicleDetails />} />
        <Route path="vehicles/:id/edit" element={<RequireRole role="manager"><VehicleForm edit /></RequireRole>} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/:id" element={<DriverDetails />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="trips" element={<Trips />} />
        <Route path="geofence" element={<Geofence />} />
      </Route>

      <Route path="*" element={<div className="p-6">Page not found</div>} />
    </Routes>
  )
}

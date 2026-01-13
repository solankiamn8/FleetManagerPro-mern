import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../src/hooks/useAuth'

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from "./pages/auth/VerifyEmail"

import Layout from './components/Layout'
import RequireRole from './components/RequireRole'

import Dashboard from './pages/Dashboard'
import Vehicles from './pages/vehicles/Vehicles'
import VehicleDetails from './pages/vehicles/VehicleTable'
import VehicleForm from './pages/vehicles/VehicleRow'
import Drivers from './pages/drivers/Drivers'
import DriverDetails from './pages/drivers/DriverDetails'
import Maintenance from './pages/maintenance/Maintenance'
import Trips from './pages/trips/Trips'
import PlanTrips from './pages/trips/PlanTrips'
import Geofence from './pages/Geofence'
import { Toaster } from "react-hot-toast"
import AuthGate from './components/AuthGate'
import AcceptInvite from './pages/auth/AcceptInvite'
import TeamMembersPage from './pages/team/TeamMembersPage'
import TeamInvitesPage from './pages/team/TeamInvitesPage'
import TeamActivityPage from './pages/team/TeamActivityPage'
import LiveTracking from "./pages/tracking/LiveTracking"


export default function App() {
  const { user } = useAuth()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
          },
        }}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />


        <Route
          path="/app"
          element={
            <AuthGate>
              <Layout />
            </AuthGate>
          }
        >


          <Route index element={<Dashboard />} />
          <Route path="team">
            <Route path="members" element={<TeamMembersPage />} />
            <Route path="invites" element={<TeamInvitesPage />} />
            <Route path="activity" element={<TeamActivityPage />} />
          </Route>
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/new" element={<RequireRole role="manager"><VehicleForm /></RequireRole>} />
          <Route path="vehicles/:id" element={<VehicleDetails />} />
          <Route path="vehicles/:id/edit" element={<RequireRole role="manager"><VehicleForm edit /></RequireRole>} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="drivers/:id" element={<DriverDetails />} />
          <Route path="trips">
            <Route index element={<Trips />} />
            <Route
              path="plan"
              element={
                <RequireRole role="manager">
                  <PlanTrips />
                </RequireRole>
              }
            />
          </Route>
          <Route path="tracking" element={<LiveTracking />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="trips" element={<Trips />} />
          <Route path="geofence" element={<Geofence />} />
        </Route>

        <Route path="*" element={<div className="p-6">Page not found</div>} />
      </Routes>
    </>
  )
}

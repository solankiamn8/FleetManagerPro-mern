import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import TripPlanner from "./TripPlanner";
import VehicleSelect from "./VehicleSelect";

export default function PlanTrips({ onPlanned }) {
  const [routeData, setRouteData] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);

  const confirmTrip = async () => {
    if (!vehicle) return;

    try {
      setLoading(true);

      await api.post("/trips/create", {
        vehicleId: vehicle._id,
        startLocation: routeData.start,
        endLocation: routeData.end,
        selectedRouteIndex: routeData.selectedRouteIndex,
      });

      toast.success("Trip planned successfully")
      setRouteData(null)
      setVehicle(null)
      onPlanned?.()

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to plan trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <TripPlanner onRouteReady={setRouteData} />

      {routeData && (
        <VehicleSelect
          selected={vehicle}
          onSelect={setVehicle}
          onlyEligible
        />
      )}

      {routeData && vehicle && (
        <button
          onClick={confirmTrip}
          disabled={loading}
          className="btn-grad"
        >
          Confirm Trip
        </button>
      )}
    </div>
  );
}

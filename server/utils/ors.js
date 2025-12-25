import axios from "axios";
import polyline from "@mapbox/polyline";
import { env } from "../config/env.js";

/**
 * Get real road-based routes from OpenRouteService
 */
export const getRouteOptionsFromORS = async (start, end) => {
  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  const response = await axios.post(
    url,
    {
      coordinates: [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ],
      alternative_routes: {
        target_count: 3,
        weight_factor: 1.4,
      },
    },
    {
      headers: {
        Authorization: env.ORS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const routes = response.data.routes;
  if (!routes || !routes.length) return [];

  return routes.map((route, index) => {
    // 🔑 Decode encoded polyline
    const decoded = polyline.decode(route.geometry);

    return {
      name: index === 0 ? "Fastest Route" : `Alternative Route ${index}`,
      distanceKm: +(route.summary.distance / 1000).toFixed(2),
      estimatedTimeMin: Math.round(route.summary.duration / 60),

      // Convert to {lat, lng}
      polyline: decoded.map(([lat, lng]) => ({ lat, lng })),
    };
  });
};

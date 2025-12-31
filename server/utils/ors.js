import axios from "axios";
import polyline from "@mapbox/polyline";
import { env } from "../config/env.js";

/**
 * Get real road-based routes from OpenRouteService
 */
export const getRouteOptionsFromORS = async (start, end) => {
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
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
        timeout: 5000,
      }
    );

    const routes = response.data.routes;
    if (!routes || !routes.length) return [];

    return routes.map((route, index) => {
      const decoded = polyline.decode(route.geometry);

      return {
        name: index === 0 ? "Fastest Route" : `Alternative Route ${index}`,
        distanceKm: +(route.summary.distance / 1000).toFixed(2),
        estimatedTimeMin: Math.round(route.summary.duration / 60),
        polyline: decoded.map(([lat, lng]) => ({ lat, lng })),
      };
    });

  } catch (err) {
    // ✅ ORS distance limit or other API errors
    if (err.response?.data?.error?.code === 2004) {
      console.warn("ORS distance limit exceeded");
      return [];
    }

    console.error("ORS error:", err.message);
    return [];
  }
};


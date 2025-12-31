import { Router } from "express";
import axios from "axios";
import { env } from "../config/env.js";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: env.ORS_API_KEY,
          text: q,
          size: 5,
          boundary_country: "IN", // 🔑 improves Indian results
        },
      }
    );

    const features = response.data?.features || [];

    const results = features.map((f) => ({
      place_id: f.properties.id,
      display_name: f.properties.label,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    }));

    res.json(results);
  } catch (err) {
    console.error("Geo search error:", err.response?.data || err.message);
    res.status(200).json([]); // never crash UI
  }
});

export default router;

import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  make: { type: String },
  model: { type: String },
  licensePlate: { type: String, unique: true, required: true, index: true },
  mileage: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active', index: true },
  
  // GeoJSON point for accurate geospatial queries
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [77.2090, 28.6139] } // [lng, lat]
  },
  locationUpdatedAt: { type: Date, default: Date.now, index: true },
  
  fuelEfficiency: { type: Number, default: 12 }, // km/l
  
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  activeTrip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },

  maintenanceDueAtMiles: Number,
  maintenanceDueAtDate: Date,
}, { timestamps: true });

vehicleSchema.index({ location: '2dsphere' });

export default mongoose.model('Vehicle', vehicleSchema);

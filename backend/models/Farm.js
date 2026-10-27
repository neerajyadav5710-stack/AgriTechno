import mongoose from 'mongoose';

const plotSchema = new mongoose.Schema({
  plotName: { type: String, required: true },
  area: { type: Number, required: true }, // in acres
  currentCrop: { type: String, default: 'Fallow' },
  soilHealthStatus: {
    type: String,
    enum: ['Optimal', 'Moderate', 'Needs Attention', 'Unknown'],
    default: 'Unknown',
  },
  moistureIndex: { type: Number, default: 45 }, // percentage %
  irrigationStatus: {
    type: String,
    enum: ['Normal', 'Needs Water', 'Flooded'],
    default: 'Normal',
  },
});

const farmSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmName: {
      type: String,
      required: [true, 'Please provide farm name'],
      trim: true,
    },
    totalArea: {
      type: Number,
      required: [true, 'Please specify total area in acres'],
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black Soil', 'Red Soil', 'Sandy Loam', 'Clayey', 'Laterite'],
      default: 'Alluvial',
    },
    irrigationType: {
      type: String,
      enum: ['Drip Irrigation', 'Sprinkler', 'Canal Irrigation', 'Tube Well', 'Rainfed'],
      default: 'Tube Well',
    },
    location: {
      state: { type: String, default: 'Haryana' },
      district: { type: String, default: 'Karnal' },
      village: { type: String, default: 'Nilokheri' },
      latitude: { type: Number, default: 29.6857 },
      longitude: { type: Number, default: 76.9905 },
    },
    plots: [plotSchema],
    sensorTelemetry: {
      soilMoisture: { type: Number, default: 42 }, // %
      soilTemp: { type: Number, default: 24 }, // °C
      ambientTemp: { type: Number, default: 28 }, // °C
      ambientHumidity: { type: Number, default: 60 }, // %
      lastUpdated: { type: Date, default: Date.now },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;

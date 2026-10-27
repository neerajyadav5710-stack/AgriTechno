import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      default: 'Hybrid High-Yield',
    },
    season: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid', 'Perennial'],
      default: 'Rabi',
    },
    plotName: {
      type: String,
      default: 'Plot A',
    },
    sowingDate: {
      type: Date,
      default: Date.now,
    },
    expectedHarvestDate: {
      type: Date,
      default: () => new Date(+new Date() + 110 * 24 * 60 * 60 * 1000), // ~110 days
    },
    stage: {
      type: String,
      enum: ['Germination', 'Vegetative', 'Tillering/Branching', 'Flowering', 'Grain Filling', 'Maturity/Harvest'],
      default: 'Vegetative',
    },
    healthStatus: {
      type: String,
      enum: ['Excellent', 'Good', 'Moderate', 'At Risk', 'Diseased'],
      default: 'Good',
    },
    targetYield: {
      type: Number, // in quintals/acre
      default: 24,
    },
    currentEstimatedYield: {
      type: Number,
      default: 22.5,
    },
    notes: {
      type: String,
      default: '',
    },
    fertilizerSchedule: [
      {
        stageName: String,
        fertilizerName: String,
        dosage: String,
        status: { type: String, enum: ['Pending', 'Completed', 'Skipped'], default: 'Pending' },
        dueDate: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;

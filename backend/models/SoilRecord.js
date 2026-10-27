import mongoose from 'mongoose';

const soilRecordSchema = new mongoose.Schema(
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
    plotName: {
      type: String,
      default: 'Main Plot',
    },
    sampleDate: {
      type: Date,
      default: Date.now,
    },
    nitrogen: {
      type: Number, // kg/hectare
      required: true,
    },
    phosphorus: {
      type: Number, // kg/hectare
      required: true,
    },
    potassium: {
      type: Number, // kg/hectare
      required: true,
    },
    phLevel: {
      type: Number, // 1 to 14
      required: true,
    },
    organicCarbon: {
      type: Number, // %
      default: 0.55,
    },
    electricalConductivity: {
      type: Number, // dS/m
      default: 0.8,
    },
    overallHealth: {
      type: String,
      enum: ['Optimal', 'Deficient', 'High Toxicity', 'Slightly Alkaline', 'Acidic'],
      default: 'Optimal',
    },
    fertilizerDeficit: {
      ureaNeeded: { type: Number, default: 0 }, // kg/acre
      dapNeeded: { type: Number, default: 0 }, // kg/acre
      mopNeeded: { type: Number, default: 0 }, // kg/acre
      gypsumNeeded: { type: Number, default: 0 }, // kg/acre
    },
    recommendedCrops: [
      {
        crop: String,
        suitabilityScore: Number, // e.g. 95%
        reason: String,
      },
    ],
    advisoryNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const SoilRecord = mongoose.model('SoilRecord', soilRecordSchema);
export default SoilRecord;

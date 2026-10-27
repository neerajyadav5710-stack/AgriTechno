import mongoose from 'mongoose';

const pestAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pestName: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Severe'],
      default: 'Moderate',
    },
    affectedCrops: [
      {
        type: String,
      },
    ],
    symptoms: {
      type: String,
      required: true,
    },
    preventativeMeasures: [
      {
        type: String,
      },
    ],
    recommendedSprays: [
      {
        type: String,
      },
    ],
    region: {
      state: { type: String, default: 'All' },
      district: { type: String, default: 'All' },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

const PestAlert = mongoose.model('PestAlert', pestAlertSchema);
export default PestAlert;

import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Seeds', 'Bio-Fertilizers', 'Pest Control', 'Machinery & Tools', 'Smart Sensors', 'Irrigation'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    subsidyEligible: {
      type: Boolean,
      default: false,
    },
    subsidyPercent: {
      type: Number,
      default: 0, // e.g. 20% PM-KUSUM or DBT
    },
    stock: {
      type: Number,
      default: 100,
    },
    unit: {
      type: String,
      default: 'bag',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=500&q=80',
    },
    brand: {
      type: String,
      default: 'Kisan Shakti',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;

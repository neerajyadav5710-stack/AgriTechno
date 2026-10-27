import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  unit: { type: String, default: 'unit' },
  subsidySaved: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    subsidyDiscount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      village: { type: String, default: '' },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'UPI / NetBanking', 'Kisan Credit Card (KCC)'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    trackingId: {
      type: String,
      default: () => 'AGT-' + Math.floor(100000 + Math.random() * 900000),
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

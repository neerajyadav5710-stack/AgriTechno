import Order from '../models/Order.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }

    // Calculate totals
    let subtotal = 0;
    let subsidyDiscount = 0;

    const processedItems = items.map((item) => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      const subsidy = item.subsidySaved ? Number(item.subsidySaved) : 0;
      subsidyDiscount += subsidy;

      return {
        resource: item.id || item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit || 'unit',
        subsidySaved: subsidy,
      };
    });

    const totalAmount = Math.max(0, subtotal - subsidyDiscount);
    const trackingId = 'AGT-' + Math.floor(100000 + Math.random() * 900000);

    if (getDbStatus()) {
      const order = await Order.create({
        buyer: userId,
        items: processedItems,
        subtotal,
        subsidyDiscount,
        totalAmount,
        shippingAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
        orderStatus: 'Placed',
        trackingId,
      });
      return res.status(201).json({ success: true, data: order });
    } else {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        buyer: userId,
        items: processedItems,
        subtotal,
        subsidyDiscount,
        totalAmount,
        shippingAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
        orderStatus: 'Placed',
        trackingId,
        createdAt: new Date(),
      };
      mockData.orders.unshift(newOrder);
      return res.status(201).json({ success: true, data: newOrder });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (getDbStatus()) {
      const orders = await Order.find({ buyer: userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    } else {
      const orders = mockData.orders.filter((o) => String(o.buyer) === String(userId));
      return res.json({ success: true, count: orders.length, data: orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    if (getDbStatus()) {
      const orders = await Order.find().populate('buyer', 'name email phone').sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    } else {
      return res.json({ success: true, count: mockData.orders.length, data: mockData.orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order delivery status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (getDbStatus()) {
      const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    } else {
      const order = mockData.orders.find((o) => String(o._id) === String(req.params.id));
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.orderStatus = orderStatus;
      return res.json({ success: true, data: order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

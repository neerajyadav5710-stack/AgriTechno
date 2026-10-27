import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import PestAlert from '../models/PestAlert.js';
import Consultation from '../models/Consultation.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Get aggregate analytics for Admin Command Center
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    if (getDbStatus()) {
      const [totalUsers, totalFarms, totalCrops, orders, activeAlerts, openTickets] = await Promise.all([
        User.countDocuments(),
        Farm.countDocuments(),
        Crop.countDocuments(),
        Order.find(),
        PestAlert.countDocuments({ isActive: true }),
        Consultation.countDocuments({ status: { $ne: 'Resolved' } }),
      ]);

      const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
      const totalSubsidyDisbursed = orders.reduce((sum, ord) => sum + (ord.subsidyDiscount || 0), 0);

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalFarms,
          totalCrops,
          totalOrders: orders.length,
          totalRevenue,
          totalSubsidyDisbursed,
          activeAlerts,
          openTickets,
        },
      });
    } else {
      const orders = mockData.orders;
      const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
      const totalSubsidyDisbursed = orders.reduce((sum, ord) => sum + (ord.subsidyDiscount || 0), 0);

      return res.json({
        success: true,
        stats: {
          totalUsers: mockData.users.length,
          totalFarms: mockData.farms.length,
          totalCrops: mockData.crops.length,
          totalOrders: orders.length,
          totalRevenue,
          totalSubsidyDisbursed,
          activeAlerts: mockData.pestAlerts.filter((a) => a.isActive !== false).length,
          openTickets: mockData.consultations.filter((c) => c.status !== 'Resolved').length,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    if (getDbStatus()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    } else {
      const users = mockData.users.map(({ password, ...u }) => u);
      return res.json({ success: true, count: users.length, data: users });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['farmer', 'expert', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (getDbStatus()) {
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: user });
    } else {
      const user = mockData.users.find((u) => String(u._id) === String(req.params.id));
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.role = role;
      const { password, ...safeUser } = user;
      return res.json({ success: true, data: safeUser });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import PestAlert from '../models/PestAlert.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Get all active pest alerts
// @route   GET /api/pest-alerts
// @access  Public
export const getPestAlerts = async (req, res) => {
  try {
    if (getDbStatus()) {
      const alerts = await PestAlert.find({ isActive: true }).sort({ createdAt: -1 });
      return res.json({ success: true, count: alerts.length, data: alerts });
    } else {
      const alerts = mockData.pestAlerts.filter((a) => a.isActive !== false);
      return res.json({ success: true, count: alerts.length, data: alerts });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Broadcast new pest alert (Admin/Expert)
// @route   POST /api/pest-alerts
// @access  Private (Admin or Expert)
export const createPestAlert = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { title, pestName, severity, affectedCrops, symptoms, preventativeMeasures, recommendedSprays, region } = req.body;

    if (!title || !pestName || !symptoms) {
      return res.status(400).json({ success: false, message: 'Title, pest name and symptoms are required' });
    }

    if (getDbStatus()) {
      const alert = await PestAlert.create({
        title,
        pestName,
        severity: severity || 'Moderate',
        affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
        symptoms,
        preventativeMeasures: Array.isArray(preventativeMeasures) ? preventativeMeasures : [preventativeMeasures],
        recommendedSprays: Array.isArray(recommendedSprays) ? recommendedSprays : [recommendedSprays],
        region: region || { state: 'All', district: 'All' },
        reportedBy: userId,
        isActive: true,
      });
      return res.status(201).json({ success: true, data: alert });
    } else {
      const newAlert = {
        _id: 'pest_' + Date.now(),
        title,
        pestName,
        severity: severity || 'Moderate',
        affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
        symptoms,
        preventativeMeasures: Array.isArray(preventativeMeasures) ? preventativeMeasures : [preventativeMeasures],
        recommendedSprays: Array.isArray(recommendedSprays) ? recommendedSprays : [recommendedSprays],
        region: region || { state: 'All', district: 'All' },
        reportedBy: userId,
        isActive: true,
        broadcastDate: new Date(),
        createdAt: new Date(),
      };
      mockData.pestAlerts.unshift(newAlert);
      return res.status(201).json({ success: true, data: newAlert });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

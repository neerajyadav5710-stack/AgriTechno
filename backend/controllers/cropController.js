import Crop from '../models/Crop.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Get all crops for user/farm
// @route   GET /api/crops
// @access  Private
export const getCrops = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { farmId } = req.query;

    if (getDbStatus()) {
      let query = req.user.role === 'admin' ? {} : { farmer: userId };
      if (farmId) query.farm = farmId;

      const crops = await Crop.find(query).populate('farm', 'farmName location');
      return res.json({ success: true, count: crops.length, data: crops });
    } else {
      let crops = mockData.crops;
      if (req.user.role !== 'admin') {
        crops = crops.filter((c) => String(c.farmer) === String(userId));
      }
      if (farmId) {
        crops = crops.filter((c) => String(c.farm) === String(farmId));
      }
      return res.json({ success: true, count: crops.length, data: crops });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new crop to farm
// @route   POST /api/crops
// @access  Private
export const addCrop = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { farmId, cropName, variety, season, plotName, sowingDate, expectedHarvestDate, stage, targetYield, notes } = req.body;

    if (!cropName || !farmId) {
      return res.status(400).json({ success: false, message: 'Crop name and farm ID are required' });
    }

    if (getDbStatus()) {
      const crop = await Crop.create({
        farm: farmId,
        farmer: userId,
        cropName,
        variety: variety || 'Standard High Yield',
        season: season || 'Rabi',
        plotName: plotName || 'Main Plot',
        sowingDate: sowingDate || new Date(),
        expectedHarvestDate: expectedHarvestDate || new Date(+new Date() + 110 * 24 * 60 * 60 * 1000),
        stage: stage || 'Germination',
        targetYield: targetYield || 20,
        notes: notes || '',
        fertilizerSchedule: [
          { stageName: 'Basal Dose', fertilizerName: 'DAP + MOP', dosage: '50kg DAP + 20kg MOP/acre', status: 'Pending', dueDate: new Date() },
          { stageName: 'Vegetative Top-Dressing', fertilizerName: 'Neem-Coated Urea', dosage: '30kg/acre', status: 'Pending', dueDate: new Date(+new Date() + 25 * 24 * 60 * 60 * 1000) },
        ],
      });
      return res.status(201).json({ success: true, data: crop });
    } else {
      const newCrop = {
        _id: 'crop_' + Date.now(),
        farm: farmId,
        farmer: userId,
        cropName,
        variety: variety || 'Standard High Yield',
        season: season || 'Rabi',
        plotName: plotName || 'Main Plot',
        sowingDate: sowingDate ? new Date(sowingDate) : new Date(),
        expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : new Date(+new Date() + 110 * 24 * 60 * 60 * 1000),
        stage: stage || 'Germination',
        healthStatus: 'Excellent',
        targetYield: Number(targetYield) || 20,
        currentEstimatedYield: Number(targetYield) || 20,
        notes: notes || '',
        fertilizerSchedule: [
          { stageName: 'Basal Dose', fertilizerName: 'DAP + MOP', dosage: '50kg DAP + 20kg MOP/acre', status: 'Pending', dueDate: new Date() },
          { stageName: 'Vegetative Top-Dressing', fertilizerName: 'Neem-Coated Urea', dosage: '30kg/acre', status: 'Pending', dueDate: new Date(+new Date() + 25 * 24 * 60 * 60 * 1000) },
        ],
        createdAt: new Date(),
      };
      mockData.crops.push(newCrop);
      return res.status(201).json({ success: true, data: newCrop });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop stage or health status
// @route   PUT /api/crops/:id
// @access  Private
export const updateCrop = async (req, res) => {
  try {
    if (getDbStatus()) {
      const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
      return res.json({ success: true, data: crop });
    } else {
      const index = mockData.crops.findIndex((c) => String(c._id) === String(req.params.id));
      if (index === -1) return res.status(404).json({ success: false, message: 'Crop not found' });

      mockData.crops[index] = { ...mockData.crops[index], ...req.body };
      return res.json({ success: true, data: mockData.crops[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
export const deleteCrop = async (req, res) => {
  try {
    if (getDbStatus()) {
      await Crop.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Crop removed' });
    } else {
      mockData.crops = mockData.crops.filter((c) => String(c._id) !== String(req.params.id));
      return res.json({ success: true, message: 'Crop removed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

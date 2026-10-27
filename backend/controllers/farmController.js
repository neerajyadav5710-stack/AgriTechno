import Farm from '../models/Farm.js';
import { getDbStatus } from '../config/db.js';
import { mockData } from '../data/mockStore.js';

// @desc    Get user's farms
// @route   GET /api/farms
// @access  Private
export const getMyFarms = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (getDbStatus()) {
      const query = req.user.role === 'admin' ? {} : { owner: userId };
      const farms = await Farm.find(query).populate('owner', 'name email phone');
      return res.json({ success: true, count: farms.length, data: farms });
    } else {
      let farms = mockData.farms;
      if (req.user.role !== 'admin') {
        farms = farms.filter((f) => String(f.owner) === String(userId));
      }
      return res.json({ success: true, count: farms.length, data: farms });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Private
export const getFarmById = async (req, res) => {
  try {
    if (getDbStatus()) {
      const farm = await Farm.findById(req.params.id).populate('owner', 'name email phone');
      if (!farm) {
        return res.status(404).json({ success: false, message: 'Farm not found' });
      }
      return res.json({ success: true, data: farm });
    } else {
      const farm = mockData.farms.find((f) => String(f._id) === String(req.params.id));
      if (!farm) {
        return res.status(404).json({ success: false, message: 'Farm not found' });
      }
      return res.json({ success: true, data: farm });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
export const createFarm = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { farmName, totalArea, soilType, irrigationType, location, plots } = req.body;

    if (!farmName || !totalArea) {
      return res.status(400).json({ success: false, message: 'Please provide farm name and total area' });
    }

    if (getDbStatus()) {
      const farm = await Farm.create({
        owner: userId,
        farmName,
        totalArea,
        soilType: soilType || 'Alluvial',
        irrigationType: irrigationType || 'Tube Well',
        location: location || { state: 'Haryana', district: 'Karnal', village: 'Nilokheri' },
        plots: plots || [{ plotName: 'Main Plot', area: totalArea, currentCrop: 'Fallow' }],
      });
      return res.status(201).json({ success: true, data: farm });
    } else {
      const newFarm = {
        _id: 'farm_' + Date.now(),
        owner: userId,
        farmName,
        totalArea,
        soilType: soilType || 'Alluvial',
        irrigationType: irrigationType || 'Tube Well',
        location: location || { state: 'Haryana', district: 'Karnal', village: 'Nilokheri', latitude: 29.6857, longitude: 76.9905 },
        plots: plots && plots.length > 0 ? plots : [{ _id: 'plot_' + Date.now(), plotName: 'Main Plot', area: totalArea, currentCrop: 'Fallow', moistureIndex: 45, soilHealthStatus: 'Optimal', irrigationStatus: 'Normal' }],
        sensorTelemetry: {
          soilMoisture: 45,
          soilTemp: 23,
          ambientTemp: 27,
          ambientHumidity: 60,
          lastUpdated: new Date(),
        },
        isActive: true,
        createdAt: new Date(),
      };
      mockData.farms.push(newFarm);
      return res.status(201).json({ success: true, data: newFarm });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update IoT Telemetry Simulation
// @route   POST /api/farms/:id/telemetry
// @access  Private
export const updateTelemetry = async (req, res) => {
  try {
    const { soilMoisture, soilTemp, ambientTemp, ambientHumidity } = req.body;

    if (getDbStatus()) {
      const farm = await Farm.findById(req.params.id);
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });

      farm.sensorTelemetry = {
        soilMoisture: soilMoisture !== undefined ? soilMoisture : farm.sensorTelemetry.soilMoisture,
        soilTemp: soilTemp !== undefined ? soilTemp : farm.sensorTelemetry.soilTemp,
        ambientTemp: ambientTemp !== undefined ? ambientTemp : farm.sensorTelemetry.ambientTemp,
        ambientHumidity: ambientHumidity !== undefined ? ambientHumidity : farm.sensorTelemetry.ambientHumidity,
        lastUpdated: new Date(),
      };
      await farm.save();
      return res.json({ success: true, telemetry: farm.sensorTelemetry });
    } else {
      const farm = mockData.farms.find((f) => String(f._id) === String(req.params.id));
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });

      farm.sensorTelemetry = {
        soilMoisture: soilMoisture !== undefined ? soilMoisture : farm.sensorTelemetry.soilMoisture,
        soilTemp: soilTemp !== undefined ? soilTemp : farm.sensorTelemetry.soilTemp,
        ambientTemp: ambientTemp !== undefined ? ambientTemp : farm.sensorTelemetry.ambientTemp,
        ambientHumidity: ambientHumidity !== undefined ? ambientHumidity : farm.sensorTelemetry.ambientHumidity,
        lastUpdated: new Date(),
      };
      return res.json({ success: true, telemetry: farm.sensorTelemetry });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
